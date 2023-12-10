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
window.vanillaDOM = async function({ htmlPath, cssPath, pathOrigin }, vanillaDOMcallback) {
alert(htmlPath)
    // Function to fetch and cache the resource
    async function fetchAndCache(url) {
        if ('caches' in window) {
            const cache = await caches.open('vanillaDOMCache');
            let response = await cache.match(url);

            if (!response) {
                response = await fetch(url);
                cache.put(url, response.clone());
            }

            return response;
        } else {
            // Fallback to fetch if caches is not available
            return fetch(url);
        }
    }

    try {
        const htmlResponse =  await fetchAndCache(htmlPath);
        const htmlContent =  await htmlResponse.text();
        if (typeof vanillaDOMcallback === 'function') {
            window.htmlContent = htmlContent;
            window.originBurst[pathOrigin][pathOrigin].htmlResult = htmlContent;
            console.table({htmlrendered: window.originBurst[pathOrigin].htmlResult})
            vanillaDOMcallback(htmlContent);
        }

        if (cssPath) {
            const cssResponse = await fetchAndCache(cssPath);
            const css = await cssResponse.text();
            window.css = css;
            const style = document.createElement('style');
            style.textContent = css;
            window.originBurst[pathOrigin][pathOrigin].cssResult= css;
            document.head.appendChild(style);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};



window.miniDOM = async function miniDOM(passedFunction) {
//alert('yo')
    let htmlPath;
    let cssPath;
    let targetDOM;
    let pathOrigin;
    //alert(JSON.stringify(passedFunction))

    if (passedFunction.functionFile){
        pathOrigin = passedFunction.functionFile;
    }

    if (passedFunction.htmlPath) {
        htmlPath = passedFunction.htmlPath;
    }
    if (passedFunction.cssPath) {
        cssPath = passedFunction.cssPath;
    }
    if (passedFunction.targetDOM) {
        targetDOM = passedFunction.targetDOM;
    }
    
        //check originBurst and signal burst 
        if(window.originBurst?.[pathOrigin].htmlResult === undefined && window.originBurst?.[pathOrigin].cssResult === undefined){
            if (htmlPath !== undefined && targetDOM !== undefined) {
        window.vanillaDOM({ htmlPath, cssPath, pathOrigin }, (htmlContent) => {

alert('yo')
alert(targetDOM)
            // Apply the HTML content to the DOM
            document.getElementById(targetDOM).innerHTML = htmlContent;
           // document.getElementById(targetDOM).dispatchEvent(new Event('htmlContentLoaded'));
            window[htmlPath+'domReady'] = true
           
           // window.signalBurst('load', ['getSignal']);
           // document.getElementById(targetDOM).dispatchEvent(new Event('htmlContentLoaded'));
        //    window.reRollFunctions()


        })
    
    }
 
    }else{
        //document.getElementById(targetDOM).innerHTML = window.originBurst?.[pathOrigin].htmlResult ;
    }
  
}


window.serverDOM = async function miniDOM(passedFunction, htmlContent) {

    alert('yo')
        let htmlPath;
        let cssPath;
        let targetDOM;
        let pathOrigin;
        JSON.stringify(window.passedFunction)
    
        if (passedFunction.functionFile){
            pathOrigin = passedFunction.functionFile;
        }
    
        if (passedFunction.htmlPath) {
            htmlPath = passedFunction.htmlPath;
        }
        if (passedFunction.cssPath) {
            cssPath = passedFunction.cssPath;
        }
        if (passedFunction.targetDOM) {
            targetDOM = passedFunction.targetDOM;
        }
        if ( targetDOM !== undefined && htmlContent !==undefined) {
            //check originBurst and signal burst 
           
    
                document.getElementById(targetDOM).innerHTML = htmlContent;
              
    
    
        
        }
   
        }
      
    