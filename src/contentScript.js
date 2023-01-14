'use strict';

import chroma from "chroma-js";

const init = function () {
  
  
  let modal = document.createElement('div');
  modal.setAttribute("id", "entropy-modal");
  // modal.classList.add("entropy-modal");
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
    height: 15px;
    overflow: auto;
    background-color: #114b5f;
    animation-name: modalopen;
    animation-duration: 5s;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    `;

  // TODO: Tune hyper params
  var entropy_scale = chroma.scale(["456990", "114b5f", "f45b69", "6b2737"]).gamma(0.3);
  
  var entropy = 0
  var entropy_decay = 500

  
    
  // Entropy increase listener
  // chrome.storage.onChanged.addListener((changes, areaName) => {
  //     console.log(changes, areaName);
  //     if (areaName == "local") {
  //       console.log(changes);
  //     }
  // })

  setInterval(function name(params) {
    chrome.storage.local.get("entropy")
    .then(function(curr_entropy) {
      console.log(curr_entropy.entropy);
      modal.style.backgroundColor = entropy_scale(curr_entropy.entropy)
      // modal.style.backgroundImage = `linear-gradient(90deg, ${entropy_scale(curr_entropy.entropy).alpha(1).css()} 0%, ${entropy_scale(curr_entropy.entropy * .8).alpha(1).css()} 100%)`
    })
   
  }, 800)


  let body = document.querySelector('body');
  body.insertBefore(modal, body.firstChild);
  
}


init();


