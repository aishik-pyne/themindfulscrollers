
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

const storageCache = {count:0};
fetch('correlation.json')
    .then((response) => response.json())
    .then((json) => {
        Object.assign(storageCache, json);
        chrome.storage.local.set({'correlation_matrix': json}, function() {
            chrome.storage.local.get("correlation_matrix", function(items) {
                console.log(Object.keys(items["correlation_matrix"]));
            });

            // var entropy = function () {
            //     return storageCache['Music']['Classics'];
            //   };
            // console.log(entropy());
            
        });
    });



// chrome.storage.local.set({'foo': 'hello', 'bar': 'hi'}, function() {
//     console.log('Settings saved');
//   });

// // Read it using the storage API
// chrome.storage.local.get(['foo', 'bar'], function(items) {
//     console.log('Settings retrieved', items);
// });
