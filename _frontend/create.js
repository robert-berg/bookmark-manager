const serverURL = "http://localhost:5555/";

function extractBookmarkData(bookmarkURL) {
	remoteData = getJSON(serverURL + "api?url=" + encodeURIComponent(bookmarkURL));

	if (compareStrings(remoteData.message, "item can't be processed")) {
		return null;
	}

	bookmarkData = Object.assign(
		{
			url: bookmarkURL,
			bookmarkDate: new Date().toISOString(),
			hostname: getHostname(bookmarkURL),
		},
		remoteData
	);

	return bookmarkData;
}

function getJSON(url) {
	var httpRequest = new XMLHttpRequest();
	httpRequest.open("GET", url, false);
	httpRequest.send(null);
	return JSON.parse(httpRequest.responseText);
}

function getHostname(url) {
	const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
	return matches && matches[1];
}

function compareStrings(a, b) {
	return JSON.stringify(a) === JSON.stringify(b);
}
