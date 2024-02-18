window.singlePromise = async function singlePromise(renderSchema, passedFunction, serverResult, originBurst) {
    renderSchema = window.renderSchema;
    serverResult = window.serverResult;
    passedFunction = window.passedFunction;
    originBurst = window.originBurst;

    if (passedFunction) {

        var customFunction = passedFunction;
        var customFunctionName = customFunction.functionFile;

        var baseCustomFunctionDirectory = baseUrl;
        var customFunctionDirectory = customFunction.dir;
        var customFunctionUrl = baseCustomFunctionDirectory + customFunctionDirectory + customFunctionName + '.js';


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
                   // console.log(customFunctionUrl);
                    executeFunction(customFunctionName);
                    
                };
                script.onerror = () => {
                    console.error('Error loading script:', customFunctionUrl);
                };
                document.head.appendChild(script);
            } else {
                // Script already exists; execute the function immediately if it exists
                console.log(`Script already loaded: ${customFunctionUrl}`);
                executeFunction(customFunctionName);
                  
            }
        }
    }

    async function executeFunction(customFunctionName) {
//('executing function customFunctionName')
        if (typeof window[customFunctionName] === 'function') {
            vanillaShortcuts(customFunctionName, passedFunction);
            initView = window[customFunctionName](renderSchema, passedFunction, serverResult, originBurst);

             // window[customFunctionName](renderSchema, passedFunction, serverResult, originBurst);
            if (serverResult) {
               // console.log(JSON.stringify(serverResult));
                window.serverResult = serverResult;
                new Promise((resolve, reject) => {
                    resolve(window[customFunctionName](renderSchema, passedFunction, originBurst));
                }).then(() => {
                    if(renderSchema.customFunctions[customFunctionName] && renderSchema.customFunctions[customFunctionName].role !== 'rollCall' && renderSchema.customFunctions[customFunctionName].targetDOM){
                        loadDOM( window[customFunctionName+'Config'](), customFunctionName, renderSchema.landing, window[customFunctionName]);
                    };
                    if(renderSchema.customFunctions[customFunctionName]?.subDOM){
                    subDOM(customFunctionName);

                    }
                  //  window[customFunctionName+'View'];

                }).catch(error => {
                    console.error(error);
                });
            } else {

                new Promise((resolve, reject) => {
                    resolve(window[customFunctionName](renderSchema, passedFunction, originBurst));
                     
                }).then(() => {
                    if(renderSchema.customFunctions[customFunctionName] && renderSchema.customFunctions[customFunctionName].role !== 'rollCall' && renderSchema.customFunctions[customFunctionName].targetDOM){
                        loadDOM( window[customFunctionName+'Config'](),customFunctionName, renderSchema.landing, window[customFunctionName]);
                    };
                    if(renderSchema.customFunctions[customFunctionName]?.subDOM){
                    subDOM(customFunctionName);
                    
                    }
                  //  window[customFunctionName+'View']();

                }).catch(error => {
                    console.error(error);
                });
                
            }
              
            window.removeLoader();
            console.info(`Function ${customFunctionName} has been executed`);
            
        } else {
       
            console.warn(`Function ${customFunctionName} is not defined on the window object, Expected if first load`);
        }
      
    }
}

window.singlePromise = singlePromise;


window.vanillaShortcuts = function vanillaShortcut(customFunctionName, passedFunction){
    let shortcutOrigin;
    //if string origin is
    if(typeof passedFunction?.originBurst === "string"){
        shortcutOrigin = passedFunction?.originBurst;
    }else{
        //make sure you have an object, including 'namespace' property
        shortcutOrigin = passedFunction?.originBurst?.namespace;

    }
    //gets the whole schema for customFunction, ie window.somefunctionSchema will result in somefunction schema config from customFunctions in window.renderSchema (full view config)
    window[customFunctionName+'Schema$'+shortcutOrigin] = passedFunction;

    //gets the dataSchema for ie window.somefunctionDataSchema
    if(passedFunction?.dataSchema !== undefined){
        window[customFunctionName+'DataSchema$'+shortcutOrigin] = passedFunction.dataSchema;
    }
}