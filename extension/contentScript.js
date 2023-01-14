
const init = function () {
    // const entropyRibbon = document.createElement('div');
    // entropyRibbon.className = "entropy-ribbon";
    // entropyRibbon.id = "entropy-ribbon";
    // document.body.prepend(entropyRibbon);

    let modal = document.createElement('div');
    modal.setAttribute("id", "modalMenu");
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
        height: 10px;
        overflow: auto;
        background-color: rgba(255,0,0,0.7);
        animation-name: modalopen;
        animation-duration: 0.5s;
    `;
    let body = document.querySelector('body');

    body.insertBefore(modal, body.firstChild);

}


init();