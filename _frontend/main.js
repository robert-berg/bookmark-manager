var app = new Vue({
	el: "#app",
	data: {
		bookmarks: [],
		keywordFilter: null,
		searchFilter: null,
	},
	created() {
		this.readBookmarks();
	},
	methods: {
		createBookmark: (url) => {
			app.bookmarks = app.bookmarks.concat(extractBookmarkData(url));
			app.save();
		},
		save: () => {
			setData(app.bookmarks);
		},

		toggleFilter(filter, value) {
			switch (filter) {
				case "searchFilter":
					this.keywordFilter = null;
					this.searchFilter = value;
					break;

				case "keywordFilter":
					app.keywordFilter = value;
					app.searchFilter = null;
					document.querySelector("#fixed-header-drawer-exp").value = null;
					break;

				case "reset":
					app.keywordFilter = null;
					app.searchFilter = null;
					document.querySelector("#fixed-header-drawer-exp").value = null;
					break;
			}
		},

		readBookmarks: () => {
			getData().then(function (result) {
				if (result["data"] === undefined) {
					app.bookmarks = [];
				} else {
					app.bookmarks = result["data"][0];
				}
			});
		},
		deleteBookmark: (url) => {
			app.bookmarks = app.bookmarks.filter((element) => element.url != url);
			app.save();
		},

	},
	computed: {
		bookmarksCount() {
			return this.bookmarks.slice(0).length;
		},
		filterBookmarks() {
			var b = [];
			b = this.bookmarks.slice(0);
			if (this.keywordFilter !== null) {
				b = b.filter((element) => {
					for (var i = 0; i < element.keywords.length; i++) {
						if (element.keywords[i] === this.keywordFilter.toLowerCase()) {
							return true;
						}
					}

					return false;
				});
			} else if (this.searchFilter !== null) {
				b = b.filter((element) => {
					var filter = this.searchFilter.toLowerCase();

					for (var i = 0; i < element.keywords.length; i++) {
						if (element.keywords[i] === filter) {
							return true;
						}
					}

					var dataToFilter = [element.text, element.summary, element.title, element.url];

					return dataToFilter.some((myString) => {
						if (myString !== null) {
							myString = myString.replace(/\n/g, " ");
							myString = myString.toLowerCase();

							return myString.includes(filter);
						}
					});
				});
			}
			return b.sort((a, b) => {
				return new Date(b.bookmarkDate) - new Date(a.bookmarkDate);
			});
		},
		extractTags() {
			var b = [];
			b = this.bookmarks.slice(0);
			var tags = [];

			for (var i = 0; i < this.bookmarksCount; i++) {
				for (var j = 0; j < b[i].keywords.length; j++) {
					// [['tag', count], ...]

					var appeared = 0;
					for (var k = 0; k < tags.length; k++) {
						if (tags[k][0] === b[i].keywords[j]) {
							tags[k][1]++;

							appeared = 1;
							continue;
						}
					}

					if (appeared === 0) {
						tags.push([b[i].keywords[j], 1]);
					}
				}
			}
			return tags.sort((a, b) => b[1] - a[1]);
		},
	},
	updated() {
		componentHandler.upgradeAllRegistered();
	},
});

chrome.storage.onChanged.addListener(function () {
	app.readBookmarks();
});
