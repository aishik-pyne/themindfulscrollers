'use strict';
// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages
import { ENTROPY_DECAY_FREQ, ENTROPY_DECAY_RATE } from "./constants";

chrome.storage.local.clear()
chrome.storage.local.set({
  entropy: 0
})

// Entropy incrementer to LS
chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {

      console.log(changeInfo);
      chrome.storage.local.get("entropy")
      .then(function(curr_entropy) {
        // console.log('data', curr_entropy);
        chrome.storage.local.set({
          // TODO: Set increament based on diffence
          entropy: parseFloat(curr_entropy.entropy) + 0.5
        })
      })
      .catch(function(reason) {
        // console.log('reason', reason);
        chrome.storage.local.set({
          entropy: 0.5
        })
      })
    }
  }
);

// Entropy decayer to LS
setInterval(function () {
  chrome.storage.local.get('entropy')
    .then(function(curr_entropy) {
      console.log("Current Entropy", curr_entropy.entropy);
      chrome.storage.local.set({
        entropy: Math.max(0, parseFloat(curr_entropy.entropy) - ENTROPY_DECAY_RATE)
      })
    })
    .catch(function(reason) {
      // console.log(reason);
      chrome.storage.local.set({
        entropy: 0
      })
     })
}, ENTROPY_DECAY_FREQ)