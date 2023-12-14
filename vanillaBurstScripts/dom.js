window.vanillaDOM = async function ({ htmlPath, cssPath }, vanillaDOMcallback) {
    try {
        // Function to load and apply CSS
        const loadCSS = async (path) => {
            let cssCacheKey = 'cachedCSS_' + path;
            let css = localStorage.getItem(cssCacheKey);

            if (!css) {
                const cssResponse = await fetch(path);
                css = await cssResponse.text();
                localStorage.setItem(cssCacheKey, css);
            }

            if (!document.head.querySelector(`style[data-css-path="${path}"]`)) {
                const style = document.createElement('style');
                style.setAttribute('data-css-path', path);
                style.textContent = css;
                document.head.appendChild(style);
            }
        };

        // Function to load HTML
        const loadHTML = async (path) => {
            let htmlCacheKey = 'cachedHTML_' + path;
            let htmlContent = localStorage.getItem(htmlCacheKey);

            if (!htmlContent) {
                const htmlResponse = await fetch(path);
                htmlContent = await htmlResponse.text();
                localStorage.setItem(htmlCacheKey, htmlContent);
            }

            return htmlContent;
        };

        // Load and apply CSS if provided
        if (cssPath) {
            await loadCSS(cssPath);
        }

        // Load HTML and call callback
        const htmlContent = await loadHTML(htmlPath);
        if (typeof vanillaDOMcallback === 'function') {
            vanillaDOMcallback(htmlContent);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};


async function miniDOM(domConfig, domFunction, initView) {
    let functionFile, htmlPath, cssPath, targetDOM, passedFunction;
    
    console.log(window.domFunction);

    // Determine the function to use
    passedFunction = domConfig.customFunctions?.[domFunction] ?? domConfig[domFunction];

    console.log("the passed" + JSON.stringify(passedFunction));
  
    if (passedFunction.functionFile) {
        functionFile = passedFunction.functionFile;
        htmlPath = passedFunction.htmlPath;
        cssPath = passedFunction.cssPath;
        targetDOM = passedFunction.targetDOM;
    } else {
        console.error("Function file not found");
        return;
    }

    // Check for cached content
    if (window.originBurst?.[functionFile]?.[functionFile]?.htmlResult !== undefined) {
        document.getElementById(targetDOM).innerHTML = window.originBurst[functionFile][functionFile].htmlResult;
        initView();
    } else {
        continueDOM(htmlPath, cssPath);
    }

    // Function to continue DOM processing
    async function continueDOM(htmlPath, cssPath) {
        window.vanillaDOM({ htmlPath, cssPath }, async (htmlContent) => {
            document.getElementById(targetDOM).innerHTML = htmlContent;
            
            // Cache the result if not already cached
            window.originBurst = window.originBurst || {};
            window.originBurst[functionFile] = window.originBurst[functionFile] || {};
            window.originBurst[functionFile][functionFile] = window.originBurst[functionFile][functionFile] || {};
            window.originBurst[functionFile][functionFile].htmlResult = htmlContent;

            initView();
        });
    }
}

window.componentDOM = function componentDOM(htmlPath, cssPath, targetDOM){
    window.vanillaDOM({ htmlPath, cssPath },async (htmlContent) => {
         document.getElementById(targetDOM).innerHTML = htmlContent;
    })

}


///a dom shortcut 
window.checkDOM = function checkDOM(targetDOM){
    alert (targetDOM);
    let appShell = document.getElementById(targetDOM);
    if(appShell.length !==undefined){
        checkDOM = window.originBurst[thestate][thestate].serverResult;
        if (checkDOM){
            hasDOM = true;
            return hasDOM
        }
    }else{
        hasDOM = false;
        return hasDOM
    }


}