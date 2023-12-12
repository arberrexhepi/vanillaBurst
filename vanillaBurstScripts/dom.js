// window.vanillaDOM = async function({ htmlPath, cssPath }, vanillaDOMcallback) {
//     try {
//         const htmlResponse = await fetch(htmlPath);
//         const htmlContent = await htmlResponse.text();
       
//         // Call the callback function with the HTML content
//         if (typeof vanillaDOMcallback === 'function') {
//             vanillaDOMcallback(htmlContent);
//         }
//  if (cssPath) {
//             const cssResponse = await fetch(cssPath);
//             const css = await cssResponse.text();
//             const style = document.createElement('style');
//             style.textContent = css;
//             document.head.appendChild(style);
//         }
       
//     } catch (error) {
//         console.error('Error:', error);
//     }
// };



window.vanillaDOM = async function ({ htmlPath, cssPath }, vanillaDOMcallback) {
    try {
        const htmlResponse = await fetch(htmlPath);
        const htmlContent = await htmlResponse.text();

        // Call the callback function with the HTML content
        if (typeof vanillaDOMcallback === 'function') {
            vanillaDOMcallback(htmlContent);
        }
        if (cssPath) {
            const cssResponse = await fetch(cssPath);
            const css = await cssResponse.text();
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
            
        }

    } catch (error) {
        console.error('Error:', error);
    }
};


async function miniDOM(domConfig, domFunction, initView) {
    passedFunction = domConfig.customFunctions[domFunction];
    let htmlPath;
    let cssPath;
    let targetDOM;

    if (passedFunction.functionFile) {
        htmlPath = passedFunction.htmlPath;
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
           // alert(htmlPath)
            // Apply the HTML content to the DOM
            document.getElementById(targetDOM).innerHTML = htmlContent;
            if(window.originBurst?.[functionFile]?.[functionFile] !== undefined){
                window.originBurst[functionFile][functionFile].htmlResult = htmlContent
                await window.originBurst[functionFile][functionFile].htmlResult
                //window.signalBurst('load', ['getSignal'], htmlContent);
            }else{
               // alert('yo')

            }
            initView();

        })
    }
    
}


///test an idea with this below maybe not connected to anything 
window.checkDOM = function checkDOM(renderSchema){
    renderSchema = window.renderSchema;
   // alert(JSON.stringify(renderSchema))
    let thestate= history.state.stateTagName;
    let functionFile;


    let hasDOM = false;
    let targetDOM = renderSchema.customFunctions[thestate].targetDOM;
   // alert(targetDOM);
    if(window.originBurst?.[thestate]?.[thestate]?.serverResult!== undefined){
        checkDOM = window.originBurst[thestate][thestate].serverResult;
        if (checkDOM){
            hasDOM = true;
            document.getElementById(targetDOM).innerHTML = window.originBurst[thestate][thestate].serverResult;
    
           // alert(hasDOM)
          
           // return hasDOM

        }
    }else{
        hasDOM = false;
        //alert(hasDOM)

      //  return hasDOM;
    }


}