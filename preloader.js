window.frozenVanilla("preloaderAnimation", function () {
  // const loader = document.createElement("div");
  // loader.id = "preloader";
  // loader.nonce = window.nonceBack();
  // loader.style.position = "fixed";
  // loader.style.top = "50%";
  // loader.style.left = "50%";
  // loader.style.transform = "translate(-50%, -50%)";
  // loader.style.width = "40px";
  // loader.style.height = "40px";
  // loader.style.border = "4px solid #3498db";
  // loader.style.borderTop = "4px solid transparent";
  // loader.style.borderRadius = "50%";
  // loader.style.animation = "spin 1s linear infinite";
  // const keyframes = `
  //   @keyframes spin {
  //       0% { transform: rotate(0deg); }
  //       100% { transform: rotate(360deg); }
  //   }
  //   `;
  ///content policy broke this sample script, will add in the UI packages instead
});

function removeLoader() {
  const loader = document.querySelector("#preloader");
  if (loader) {
    loader.parentNode.removeChild(loader);
  }
}

window.removeLoader = removeLoader;
