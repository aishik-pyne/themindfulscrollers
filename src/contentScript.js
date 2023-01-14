'use strict';

import chroma from "chroma-js";
// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

// Log `title` of current active web page

// const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
// console.log(
//   `Page title is: '${pageTitle}' - evaluated by Chrome extension's 'contentScript.js' file`
// );

// // Communicate with background file by sending a message
// chrome.runtime.sendMessage(
//   {
//     type: 'GREETINGS',
//     payload: {
//       message: 'Hello, my name is Con. I am from ContentScript.',
//     },
//   },
//   (response) => {
//     console.log(response.message);
//   }
// );

// // Listen for message
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.type === 'COUNT') {
//     console.log(`Current count is ${request.payload.count}`);
//   }

//   // Send an empty response
//   // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
//   sendResponse({});
//   return true;
// });


const init = function () {


  let modal = document.createElement('div');
  modal.setAttribute("id", "entropy-modal");
  modal.classList.add("entropy-modal");
  modal.style.cssText = `
      all: unset;
      font-family: Helvetica Neue;
      font-size: 12px;
      margin: 0;
      padding: 0;
      display: block;
      position: fixed;
      z-index: 100000;
      right: 0;
      top: 0;
      width: 100%;
      height: 10px;
      overflow: auto;
      background-color: rgba(255,0,0,0.7);
      animation-name: modalopen;
      animation-duration: 5s;
  `;

  setInterval(function () {
      // const element = document.querySelector('.entropy-modal');
      modal.style.backgroundColor = chroma.random();
      console.log(modal.style.height);
      modal.style.height = modal.style.height + 10;
      modal.style.height = `20px`;
  }, 1000)

  let body = document.querySelector('body');
  body.insertBefore(modal, body.firstChild);

}


init();