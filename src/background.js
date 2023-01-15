'use strict';
// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages
import { ENTROPY_DECAY_FREQ, ENTROPY_DECAY_RATE } from "./constants";
import categories from './youtube_categories.json' assert {type: 'json'};
import correlation from './correlation.json' assert {type: 'json'};

chrome.storage.local.clear()
chrome.storage.local.set({
  entropy: 0,
  category: "",
  trackHistory: []
})

// Entropy incrementer to LS
chrome.tabs.onUpdated.addListener(
  function (tabId, changeInfo, tab) {
    let url = tab.url
    if (changeInfo.status == 'complete') {

      // let newUrl = changeInfo.url


      const re = new RegExp("[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]", "g")
      let videoId = re.exec(url)[0]

      let apiKey = "AIzaSyBfUIhZD9uD8haODkkf2qt6ARWYol7tC3g"
      let URL = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${apiKey}`

      fetch(URL)
        .then(resp => resp.json())
        .then(
          resp => {
            let videoDetails = {
              title: "",
              description: "",
              category: ""
            }

            videoDetails['title'] = resp['items'][0]['snippet']['title']
            videoDetails['description'] = resp['items'][0]['snippet']['description']
            videoDetails['category'] = categories[resp['items'][0]['snippet']['categoryId']]


            let newCategory = videoDetails['category'];
            
            console.log(`Fetch video category: ${newCategory}`)

            chrome.storage.local.get(["category", "entropy"])
              .then(function (data) {
                let oldCategory = data.category
                let oldEntropy = data.entropy

                console.log(`Old cat ${oldCategory} new cat ${newCategory}`);
                
                let similarity = correlation[newCategory][oldCategory === "" ? newCategory : oldCategory]
                console.log(`Similarity is ${similarity}`);

                chrome.storage.local.set({
                  category: newCategory,
                  entropy: oldEntropy + (1 - similarity)
                }).catch(reason => console.error(`Failing to store entropy in LS`))

                chrome.storage.local.get("trackHistory")
                  .then(function (data) {
                    let historyItems = data.trackHistory
                    historyItems.push({ category: newCategory, timestamp: Date.now(), entropy: similarity })
                    // console.log(historyItems)

                    chrome.storage.local.set({
                      trackHistory: historyItems
                    })
                  })
                  .catch(function (reason) {
                    console.error(`Failed to update trackHistory ${reason}`);
                  })
              })
              .catch(function (reason) {
                console.error(`Failed to update entropy ${reason}`);
                chrome.storage.local.set({
                  entropy: 0.5
                })
              })

            
              

          }
        )

    }
  }
);

// Entropy decayer to LS
setInterval(function () {
  chrome.storage.local.get('entropy')
    .then(function (data) {
      console.log("Current Entropy", data.entropy);
      let newEntropy = Math.max(0, parseFloat(data.entropy) - ENTROPY_DECAY_RATE)
      chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
        if (tabs.length >0) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            {
              type: 'ENTROPY',
              entropy: newEntropy
            }
          )
          .catch(()=> chrome.runtime.lastError)
        }
      })
      chrome.storage.local.set({
        entropy: Math.max(0, parseFloat(data.entropy) - ENTROPY_DECAY_RATE)
      })
    })
    .catch(function (reason) {
      chrome.storage.local.set({
        entropy: 0
      })
    })
}, ENTROPY_DECAY_FREQ)