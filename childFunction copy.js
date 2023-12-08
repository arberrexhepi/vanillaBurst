
window.childFunction = async function childFunction(renderSchema, rollCall, runRoll, originBurst) {
    runRoll = window.runRoll;
    // alert("ran");
    if(window.runFunction === undefined){
        let runFunction = {};

    }else{
       let runFunction = window.runFunction
    }
    if (runRoll == "rollBurst" && window.ranScripts === true) {
        // alert("ran again");
       
        console.log("starting rollCall at childFunction")
        renderSchema = window.renderSchema;
        rollCall = window.rollCall;
        //let passedFunction;
        //let functionName;

        async function arrayRoll(passedFunction, functionName) {
            if (passedFunction) {
                //passedFunction.render = "burst";



                console.log("array rollCall at " + functionName + " " + JSON.stringify(passedFunction));


                if (passedFunction.dataSchema && passedFunction.role == "parent") {
                    console.log(JSON.stringify(passedFunction));
                    data = passedFunction.dataSchema;
                    let runData = "serverBurst";
                    await buildview(renderSchema, functionName, passedFunction, data, runData);
                    console.log("single rollCall has data " + functionName + " " + JSON.stringify(passedFunction));



                }
                else {
                    //passedFunction.render = "burst";

                    console.log("single rollCall no data " + functionName + " " + JSON.stringify(passedFunction));

                    await buildview(renderSchema, functionName, passedFunction);
                }
            }
        }

        //arrayRoll(passedFunction, functionName);


        if (Array.isArray(rollCall) && rollCall.length > 1) {
            let promiseChain = Promise.resolve();

            rollCall.forEach(function (element) {
                promiseChain = promiseChain.then(async function () {
                    let passedFunction = renderSchema.customFunctions[element];
                    let functionName = passedFunction.functionFile;

                    await arrayRoll(passedFunction, functionName);
                });
            });
        }
        else {

            let passedFunction = renderSchema.customFunctions[rollCall];
            let functionName = passedFunction.functionFile;
           // alert(JSON.stringify(passedFunction));
            if (passedFunction) {
                //passedFunction.render = "burst";

                console.log("single rollCall at " + functionName + " " + JSON.stringify(passedFunction));




                if (passedFunction.dataSchema && passedFunction.role == "parent") {
                    console.log("array rollCall has data " + functionName + " " + JSON.stringify(passedFunction));

                    data = passedFunction.dataSchema;
                    console.log("this is the data for parent role" + JSON.stringify(data));
                    let runData = "serverBurst";
                    
                    await buildview(renderSchema, functionName, passedFunction, data, runData);


                }
                else {
                    //passedFunction.render = "burst";

                    console.log("array rollCall no data " + functionName + " " + JSON.stringify(passedFunction));

                    await buildview(renderSchema, functionName, passedFunction);
                }

            }
        }

        async function renderFunction(renderSchema, functionName, passedFunction, serverResult, runFunction) {
                window.renderSchema = renderSchema;
                console.log("at renderfunction");
                let burst;

                let originBurst = window.originBurst || {};
                let functionResult = functionName + 'Result';
                functionNameProp = functionName
                runFunction = {[functionName]:'functionBurst'}
                        window.runFunction = runFunction;

                if (originBurst) {
                    // Handle case when originBurst is not empty
                    // Currently, there's no logic here.


                    async function updateOriginBurst(renderSchema, functionName, passedFunction, serverResult) {
                        // Make sure we have a valid renderSchema with a landing property
                        if (!renderSchema || !renderSchema.landing) {
                            console.error('Invalid renderSchema or missing landing key.');
                            return;
                        }
                        
                        const landingKey = renderSchema.landing;
                        const functionResultKey = functionName + 'Result';
                        
                        // Ensure the originBurst object exists and has a property for the landing key
                        if (!originBurst[landingKey]) {
                            console.log('Creating new landing key in originBurst:', landingKey);
                            originBurst[landingKey] = {};
                            await originBurst[landingKey];
                   
                        }
                    
                        // Ensure there is a structure for the functionName under the landing key
                        if (!originBurst[landingKey][functionName]) {
                            console.log('Creating new functionName key under landing key in originBurst:', functionName);
                            originBurst[landingKey][functionName] = {
                                fromSchema: passedFunction.originBurst || undefined ,
                                namespace: landingKey, // Assign the landingKey as the namespace if not provided
                                serverResult: undefined, // Default to undefined
                                burst: true // Indicate that this is a new entry
                            };
                            await originBurst[landingKey][functionName];
                        }
                    
                        // Check if we have a new serverResult for the functionName
                        if (serverResult && typeof serverResult === 'object' && functionResultKey !== undefined && functionResultKey in serverResult) {
                            console.log('New serverResult found for functionName:', functionName);
                            originBurst[landingKey][functionName].serverResult = serverResult[functionResultKey];
                            await  originBurst[landingKey][functionName].serverResult;
                        } else {
                            
                            console.log('No new serverResult for functionName:', functionName);
                        }
                    
                        // Check if the existing namespace is the same as the passedFunction's originBurst
                        const isSameOrigin = originBurst?.[landingKey]?.[functionName] === passedFunction.originBurst || '';
                        originBurst[landingKey][functionName].burst = !isSameOrigin;
                        await  originBurst[landingKey][functionName].burst 
                        console.log(isSameOrigin ? `Same origin for functionName: ${functionName}` : `Different origin for functionName: ${functionName}`);
                        
                        
                    }
                    
                    // Assuming renderSchema, passedFunction, originBurst, and serverResult are defined and accessible in this scope
                    updateOriginBurst(renderSchema, functionName, passedFunction, serverResult);
                    
                    
                    

                    

                    // alert("new global origin");
                    console.log("set if burst origin not set but function has a burtOrigin instruction");
                }


                // Update originBurst based on passedFunction if not already set



                if (typeof window[functionName] === 'function') {
                    window.serverResult = serverResult;
                    window.passedFunction = passedFunction;

                    window.originBurst = originBurst; // Set the global originBurst

                    if (passedFunction.role == 'parent') {
                        console.log("this is an already loaded parent function" + JSON.stringify(passedFunction));
                        window[functionName](renderSchema, serverResult, passedFunction, originBurst);
                        console.log("functionName:", functionName);


                    } else {
                        console.log("this is an already loaded nonparent function" + JSON.stringify(passedFunction));
                        window[functionName](renderSchema, passedFunction, serverResult, originBurst);
                        console.log("functionName:", functionName);


                    }

                    // passedFunction.render = "pause"; //THIS pauses rendering, it was causing issues with originBurst functions so I turned it off
                    // console.log("going to function");
                } else {

                    window.serverResult = serverResult;
                    window.passedFunction = passedFunction;
                    window.originBurst = originBurst; // Set the global originBurst
                    
                    if (passedFunction.role == 'parent') {
                        console.log("going to single promise");
                        console.log("at serverCall for parent " + functionName);
                        passedFunction.render = "burst";
                        
                        window.singlePromise(renderSchema, serverResult, passedFunction, originBurst);

                    } else {
                        console.log("at serverCall for nonparent " + functionName);
                     
                        passedFunction.render = "burst";

                        window.singlePromise(renderSchema, passedFunction, originBurst, runFunction);

                    }

                }
            
        }



        async function serverCall(data, runData) {
            window.data = data;
            window.runData = runData;
            await window.serverRender(data, runData);
            await window.serverResult;
            return window.serverResult;
            //the html is what I need to be fed dynamically to this function from another file when calling this renderMiniCartRequest funciton which I'll rename to renderView
            //$(target).html(window.serverResult);

        }

        async function buildview(renderSchema, functionName, passedFunction, data, runData) {


            if (data && runData == "serverBurst") {
                if (window.originBurst?.[renderSchema.landing]?.[functionName]?.serverResult === undefined) {
                 
                    let serverResult = serverCall(data, runData);
                    await serverResult;
                   // alert("new data for" + functionName +JSON.stringify(window.serverResult));
            
                    serverResult = window.serverResult;
                    runServerResult(serverResult)
                } else {
            

                  
                    serverResult = window.originBurst[renderSchema.landing][functionName].serverResult;
                    await serverResult;
                    //alert("originburst data for" + functionName)
                    runServerResult(serverResult)
                
                }
                async function runServerResult(serverResult) {


                    console.log("after serverCall for" + functionName);
                    resultTarget = functionName + "Result";
                    console.log(window.serverResult);
                    await renderFunction(renderSchema, functionName, passedFunction, serverResult);
                    console.log("at buildView for" + functionName);
                }

            }
            else {
                //alert("no data")
                console.log("at buildView for" + functionName);

                await renderFunction(renderSchema, functionName, passedFunction);

            }

        }







        /////client logic
        //buildData function
        //USAGE: window.getData('viewName', buildView) where viewName is the customFunction of a landing is requested, where buildView is a function you want to execute from the window.viewName function
        window.getData = async function (viewName, buildViewCallback) {
            let landingKey = renderSchema && renderSchema.landing;

            if (window.originBurst?.[renderSchema.landing]?.[viewName]?.serverResult === undefined) { 

                // Fetch new data since there's no cached data or it's been cleared


                    let resultData = window.serverResult[`${viewName}Result`];
                    if (landingKey) {
                                   if (!window.originBurst[landingKey]) {
                                       window.originBurst[landingKey] = {};
                                   }
                                   window.originBurst[landingKey][viewName] = { serverResult: resultData };
                               
                               } else{
                                   window.originBurst[viewName] = { serverResult: resultData } ;
                              
                               }               
                           //     alert('ran server data from getData');
                               await buildViewCallback(resultData);
               
               
                     // Reroll functions after building the view if reRoll is true
                      await window.reRollFunctions();
        


            } else {
                // Use cached data
                let resultData = window.originBurst[landingKey][viewName].serverResult;
                
               // alert('ran originburst data from getData');
                buildViewCallback(resultData);
            }
        
        };
        
        
        
        



    }
}

window.reRollFunctions = async function() {
    // Assuming window.rollCall is an array of function names or actual function references
    for (const functionName of window.rollCall) {
        // Check if the function exists and is indeed a function before calling
        if (typeof window[functionName] === 'function') {
            await window[functionName]();
        }
    }
};


//DOM loader
//USAGE within a window.viewName customFunction file
// window.vanillaDOM({
//     htmlPath: htmlUrlGet,
//     cssPath: cssUrlGet
//   }, (htmlContent) => {
//     doDOM(htmlContent);
//   });

window.vanillaDOM = async function({ htmlPath, cssPath }, vanillaDOMcallback) {
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