chrome.tabs.query({
    active: true,
    currentWindow: true
}, function (tabs) {

    var url = tabs[0].url
    var success = 0

    getData().then(function (result) {

        if (result['data'] === undefined) {
            bookmarks = []
        }
        else {
            bookmarks = result['data'][0];
        }

        for (var i = 0; i < bookmarks.length; i++) {
            if (bookmarks[i].url == url) {
                return success = 2
            }
        }

        const bookmarkData = extractBookmarkData(url)
        if (bookmarkData !== null) {
            bookmarks = bookmarks.concat(bookmarkData)
            setData(bookmarks)
            success = 1
        }


    }).then(() => {

        var popup = document.getElementById('popup')
        var spinner = document.getElementById('create-bookmark-spinner')
        var bookmarkManagerButton = `<button id="bookmarkManagerButton" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Manage</button>`
        var message = document.createElement('p')
        if (success === 1) {
            message.innerText = "Saved! 🙌"
        }

        else if (success === 2) {
            message.innerText = "This page has already been bookmarked."
        }
        else {

            message.innerText = "This page could not be bookmarked. 😔"
        }

        popup.removeChild(spinner)
        popup.appendChild(message)
        popup.insertAdjacentHTML("beforeEnd", bookmarkManagerButton)

        document.querySelector("#bookmarkManagerButton").addEventListener("click", () => {
            window.open("./index.html")
        })


    })

});