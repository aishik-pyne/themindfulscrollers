'use strict';
// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages
import { ENTROPY_DECAY_FREQ, ENTROPY_DECAY_RATE } from "./constants";
import categories from './youtube_categories.json' assert {type: 'json'};
import categories from './youtube_categories.json' assert {type: 'json'};

chrome.storage.local.clear()
chrome.storage.local.set({
  entropy: 0
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
            
            
            let videoCategory = videoDetails['category']
            //TODO add check for empty category


      
            chrome.storage.local.get("entropy")
              .then(function (curr_entropy) {
                // console.log('data', curr_entropy);
                chrome.storage.local.set({
                  // TODO: Set increament based on diffence
                  entropy: parseFloat(curr_entropy.entropy) + 0.5
                })
              })
              .catch(function (reason) {
                // console.log('reason', reason);
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
    .then(function (curr_entropy) {
      console.log("Current Entropy", curr_entropy.entropy);
      chrome.storage.local.set({
        entropy: Math.max(0, parseFloat(curr_entropy.entropy) - ENTROPY_DECAY_RATE)
      })
    })
    .catch(function (reason) {
      // console.log(reason);
      chrome.storage.local.set({
        entropy: 0
      })
    })
}, ENTROPY_DECAY_FREQ)