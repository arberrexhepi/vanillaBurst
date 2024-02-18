async function vanillaDOM({ htmlPath, cssPath }, vanillaDOMcallback) {
    try {
        const getContent = async (path) => {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const content = await response.text();
            return content;
        };

        // Get HTML content
        const htmlText = await getContent(htmlPath);
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const contentToUse = doc.body.innerHTML;

        if (typeof vanillaDOMcallback === 'function') {
            vanillaDOMcallback(contentToUse);
        }

        // Apply CSS content using <link> tag
        if (cssPath) {
            let linkTag = document.head.querySelector(`link[data-css-path="${cssPath}"]`);
            if (!linkTag) {
                linkTag = document.createElement('link');
                linkTag.setAttribute('rel', 'stylesheet');
                linkTag.setAttribute('href', cssPath);
                linkTag.setAttribute('data-css-path', cssPath);
                document.head.appendChild(linkTag);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}




async function miniDOM(domConfig, domFunction, originFunction, initView) {
    let thisConfig = domConfig;

    function checkAndSanitizeHTML(htmlString) {
        const cleanHTML = DOMPurify.sanitize(htmlString);

        if (cleanHTML !== htmlString) {
            // DOMPurify has stripped some content
            console.log(cleanHTML);
            // Redirect to a warning page or handle the threat accordingly
           // window.routeCall('warning')
        }

        return cleanHTML;
    }

    let functionFile, htmlPath, cssPath, targetDOM, passedFunction;

    // Determine the function to use
    passedFunction = renderSchema.customFunctions?.[domFunction] ?? domConfig[domFunction];

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
    return new Promise((resolve, reject) => {
        // Check for cached content
            // Sanitize the HTML content
            ('has burst')
            let safeHTML = checkAndSanitizeHTML(window.originBurst[originFunction][functionFile].htmlResult);

            // Get the target element or create it if it doesn't exist
            let targetElement = document.getElementById(targetDOM);
            if (!targetElement) {
                targetElement = document.createElement('div');
                targetElement.id = targetDOM;
                document.body.appendChild(targetElement);
            }

            // Assign sanitized HTML to innerHTML
            targetElement.innerHTML = safeHTML;
       
            continueDOM(htmlPath, cssPath, targetDOM).then(() => {
                resolve('domReady'); // Resolve the Promise with 'domReady'
            }).catch(error => {
                reject(error); // Reject the Promise with an error
            });
     
    });

    // Function to continue DOM processing
    async function continueDOM(htmlPath, cssPath, targetDOM) {
        ('defined')

        return new Promise((resolve, reject) => {
            vanillaDOM({ htmlPath, cssPath }, async (htmlContent) => {
                // Sanitize the HTML content
                let safeHTML = checkAndSanitizeHTML(htmlContent);

                // Get the target element or create it if it doesn't exist
                let targetElement = document.getElementById(targetDOM);
                if (!targetElement) {
                    targetElement = document.createElement('div');
                    targetElement.id = targetDOM;
                    document.body.appendChild(targetElement);
                }

                // Assign sanitized HTML to innerHTML
                targetElement.innerHTML = safeHTML;

                // Cache the result if not already cached
                if (window.originBurst?.[originFunction]?.[functionFile]?.htmlResult === undefined) {

                window.originBurst = window.originBurst || {};
                window.originBurst[originFunction] = window.originBurst[originFunction] || {};
                window.originBurst[originFunction][functionFile] = window.originBurst[originFunction][functionFile] || {};
                window.originBurst[originFunction][functionFile].htmlResult = safeHTML;
                //window.serverResult[targetDOM+'Result'] = window.originBurst[originFunction][functionFile].htmlResult;
                }
                if(renderSchema.customFunctions[originFunction]?.subDOM){
                    subDOM(functionFile);
                    window[functionFile+'View']();

                    }
                resolve(); // Resolve the Promise
            });
        });
    }

    function runInitView() {
        if (document.readyState !== 'loading') {
            initView();
        } else {
            document.addEventListener('DOMContentLoaded', initView);
        }
    }
}


// async function componentDOM(htmlPath, cssPath, targetDOM) {
//     await window.vanillaDOM({ htmlPath, cssPath }, async (htmlContent) => {
//         let targetElement = document.getElementById(targetDOM);
        
//         // If the targetDOM doesn't exist, create it
//         if (!targetElement) {
//             targetElement = document.createElement('div');
//             targetElement.id = targetDOM;
//             document.body.appendChild(targetElement);
//         }

//         // Sanitize the htmlContent before setting it
//         const cleanHTML = DOMPurify.sanitize(htmlContent);
//         targetElement.innerHTML = cleanHTML;
//     })
// }



//testing a new version of componentDOM




//promises the dom when building it in the functionFile
// ie loadDOM(window.navConfig(), 'nav', 'nav', functionView);
async function loadDOM(config, domFunction, originFunction, initView) {
    console.log(domFunction)
    try {
        const domReady = await window.miniDOM(config, domFunction, originFunction, initView);
        console.log(domReady); // Logs 'domReady'
    } catch (error) {
        console.error(error);
    }
}

async function subDOM(functionFile) {
    let subDOM = window.renderSchema?.customFunctions[functionFile]?.subDOM;

    for (let component in subDOM) {
        let { htmlDir: htmlPath, cssDir: cssPath, htmlTarget: targetDOM } = subDOM[component];

        try {
            await window.vanillaDOM({ htmlPath, cssPath }, async (htmlContent) => {
                if (targetDOM) {
                    let targetElement = document.getElementById(targetDOM);
                    
                    // If the targetDOM doesn't exist, create it
                    if (!targetElement) {
                        targetElement = document.createElement('div');
                        targetElement.id = targetDOM;
                        document.body.appendChild(targetElement);
                    }

                    // Clear the targetElement's content before setting its innerHTML
                    targetElement.innerHTML = '';
                    targetElement.innerHTML = htmlContent;
                    window[functionFile+'View']();
                }
            });
            console.log('domReady'); // Logs 'domReady'
        } catch (error) {
            console.error(error);
        }
    }
}

///a dom shortcut returns TRUE OR FALSE
async function checkDOM(targetDOM) {
    let appShell = document.getElementById(targetDOM);
    if (appShell.length !== undefined) {
        checkDOM = window.originBurst[thestate][thestate].serverResult;
        if (checkDOM) {
            hasDOM = true;
            return hasDOM
        }
    } else {
        hasDOM = false;
        return hasDOM
    }


}