chrome.runtime.onInstalled.addListener(function () {
	chrome.contextMenus.create({
		id: "Show Bookmarks",
		title: "Bookmarks",
		type: "normal",
		contexts: ["browser_action"],
		onclick: (info, tab) => {
			showBookmarks();
		},
	});
});

function showBookmarks() {
	var newURL = "index.html";
	chrome.tabs.create({ url: newURL });
}
