function getData() {
    const getStorageData = key =>
        new Promise((resolve, reject) =>
            chrome.storage.local.get(key, result =>
                chrome.runtime.lastError
                    ? reject(Error(chrome.runtime.lastError.message))
                    : resolve(result)
            )
        )
    return getStorageData('data')

}


function setData(bookmarks) {
    const setStorageData = data =>
        new Promise((resolve, reject) =>
            chrome.storage.local.set(data, () =>
                chrome.runtime.lastError
                    ? reject(Error(chrome.runtime.lastError.message))
                    : resolve()
            )
        )

    setStorageData({ data: [bookmarks] })
}

