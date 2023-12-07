function preloaderAnimation(runFunction){
    if (runFunction){
    const loader = document.createElement("preloader");
    loader.style.position = "fixed";
    loader.style.top = "50%";
    loader.style.left = "50%";
    loader.style.translateX ="-50%";
    loader.margin = "auto";
    loader.style.width = "40px";
    loader.style.height = "40px";
    loader.style.border = "4px solid #3498db";
    loader.style.borderTop = "4px solid transparent";
    loader.style.borderRadius = "50%";
    loader.style.animation = "spin 1s linear infinite";
    
    const keyframes = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    `;
    
    const style = document.createElement("style");
    style.appendChild(document.createTextNode(keyframes));
    
    document.head.appendChild(style);
    document.body.appendChild(loader);
    
}
}

function removeLoader() {
    const loader = document.querySelector("preloader");
    if (loader) {
        loader.parentNode.removeChild(loader);
    }
}

window.preloaderAnimation = preloaderAnimation;
window.removeLoader = removeLoader;

