function singlePromise(renderSchema, passedFunction, serverResult, burstOrigin, originBurst) {
    console.log("singlePromise for function " + JSON.stringify(window.passedFunction));
    renderSchema = window.renderSchema;
    serverResult = window.serverResult;
    passedFunction = window.passedFunction;
    burstOrigin = window.burstOrigin;
    originBurst = window.originBurst;

    if (passedFunction) {
        var customFunction = passedFunction;
        var customFunctionName = customFunction.functionFile;

        var baseCustomFunctionDirectory = baseUrl;
        var customFunctionDirectory = customFunction.dir;
        var customFunctionUrl = baseCustomFunctionDirectory + customFunctionDirectory + customFunctionName + '.js';

        console.log(customFunction);

        if (customFunctionName && customFunction.render === "burst") {
            const existingScript = document.querySelector(`head script[src="${customFunctionUrl}"]`);
            if (!existingScript) {
                // Script not found, create and append the script tag to the head
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = customFunctionUrl;
                script.id = customFunctionName;
                script.onload = () => {
                    window.preloaderAnimation();
                    console.log(customFunctionUrl);
                    executeFunction();
                };
                script.onerror = () => {
                    console.error('Error loading script:', customFunctionUrl);
                };
                document.head.appendChild(script);
            } else {
                // Script already exists; execute the function immediately if it exists
                console.log(`Script already loaded: ${customFunctionUrl}`);
                executeFunction();
            }
        }
    }

    async function executeFunction() {
        if (typeof window[customFunctionName] === 'function') {
            if (serverResult) {
                console.log(JSON.stringify(serverResult));
                window.burstOrigin = burstOrigin;
                window.serverResult = serverResult;
                await window[customFunctionName](renderSchema, passedFunction, serverResult, burstOrigin, originBurst);
            } else {
                await window[customFunctionName](renderSchema, passedFunction, burstOrigin, originBurst);
            }
            window.removeLoader();
        } else {
            console.warn(`Function ${customFunctionName} is not defined on the window object`);
        }
    }
}

window.singlePromise = singlePromise;
