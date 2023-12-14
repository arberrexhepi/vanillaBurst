window.vanillaDOM = async function ({ htmlPath, cssPath }, vanillaDOMcallback) {
    try {  
        
        await cssPath
        if (cssPath) {
        const cssResponse = await fetch(cssPath);
        const css = await cssResponse.text();
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
        
    }
        const htmlResponse = await fetch(htmlPath);
        const htmlContent = await htmlResponse.text();

        // Call the callback function with the HTML content
        if (typeof vanillaDOMcallback === 'function') {
            vanillaDOMcallback(htmlContent);
        }
      

    } catch (error) {
        console.error('Error:', error);
    }
};


async function miniDOM(domConfig, domFunction, initView) {
    let htmlPath;
    let cssPath;
    let targetDOM;
    let passedFunction
    console.log(window.domFunction)
    if(domConfig.customFunctions?.[domFunction] && domConfig.customFunctions?.[domFunction] !== undefined){
        passedFunction = domConfig.customFunctions[domFunction]

    }else{
        passedFunction = domConfig[domFunction]

    }
    console.log("the passed" +JSON.stringify(passedFunction))
  
    if (passedFunction.functionFile) {
        htmlPath = passedFunction.htmlPath;
    }else{
        console.error(error)
    }

    if (passedFunction.functionFile) {
        functionFile = passedFunction.functionFile;
    }
    if (passedFunction.cssPath) {
        cssPath = passedFunction.cssPath;
    }
    if (passedFunction.targetDOM) {
        targetDOM = passedFunction.targetDOM;
    }
 
    if(window.originBurst?.[functionFile]?.[functionFile]?.htmlResult !==undefined){
        //alert('hey')

        document.getElementById(targetDOM).innerHTML = window.originBurst[functionFile][functionFile].htmlResult;
        initView();
    }else{
        continueDOM(htmlPath, cssPath);
    }

     function continueDOM(htmlPath, cssPath){
        window.vanillaDOM({ htmlPath, cssPath },async (htmlContent) => {

            document.getElementById(targetDOM).innerHTML = htmlContent;
            if(window.originBurst?.[functionFile]?.[functionFile] !== undefined){
                window.originBurst[functionFile][functionFile].htmlResult = htmlContent
                await window.originBurst[functionFile][functionFile].htmlResult
            }else{

            }
            initView();

        })
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