
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status == "complete") {
        chrome.tabs.insertCSS({
            file: 'contentScript.css'
        })
        chrome.tabs.executeScript({
            file: 'contentScript.js',
        })
    }
    
})
