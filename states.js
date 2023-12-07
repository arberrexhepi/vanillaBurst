
  let ranScripts = false;
  window.ranScripts = ranScripts;
  let historyCount = 0;
  window.historyCount = historyCount;
      newRequest = false;
    window.newRequest = newRequest;


  async function stateDefine(stateTag, stateTagPath, loadParams, historyCount, schema) {
    //console.log(`Defining state: ${stateTag}`);
    loadParams;
    let currentState = {};
    stateTag = window.stateTag;
    stateTagPath = window.stateTagPath;
    loadParams = window.loadParams;
    schema = window.schema;

    

    function storeView(stateTag) {
      //approach to take to fetch already loaded views for quick render
      //return storepath + stateTag + '.js';

    };



    jquery = 'https://code.jquery.com/jquery-3.5.1.min.js';
    datetimepicker = 'https://cdnjs.cloudflare.com/ajax/libs/jquery-datetimepicker/2.5.20/jquery.datetimepicker.js';



    
    function preLoader(stateTag, stateTagPath, loadParams) {

      
      console.log(`Preloading state: ${stateTag}`);

      const scriptUrls = schema[stateTag].scripts;
      // TODO const externalScriptUrls = schema[stateTag].externalScriptUrls;
      const preloaderUrl = schema[stateTag].preloader;



      //MAIN PROMISE
      function loadScriptAndRunFunction(scriptUrls, preloaderUrl) {
        // Function to add script to the document's head
        function addScriptToHead(url) {
          // Check if the script tag with the given URL already exists
          
          // Create and append the script tag to the head
          if(!window.ranScripts || window.ranScripts === false){
            console.log('appended scritps');

          
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.setAttribute('name', 'burst');
          script.src = url;
      
          document.head.appendChild(script);
        }
        
      }
      

        // First, load the preloader script
        return new Promise((resolve, reject) => {

          if(window.ranScripts === true){
            runState(); // Call runState() explicitly

          }else{

          $.getScript(preloaderUrl, function (data, textStatus, jqxhr) {
            if (textStatus === "success") {
              addScriptToHead(preloaderUrl); // Add preloader script to head

              window.preloaderAnimation();

              // Then, load the other scripts
              Promise.all(scriptUrls.map(url => {
                return new Promise((resolve, reject) => {
                  //const cacheBuster = Date.now(); in other wors cache can go here
                  //url = url + '?v=' + cacheBuster;
                  $.getScript(url, function (data, textStatus, jqxhr) {
                    if (textStatus === "success") {
                      
                     
                      addScriptToHead(url); // Add the successfully loaded script to head
                      
                    
                      resolve(); // Resolve the promise for this URL
                    } else {
                      reject(new Error(`Failed to load script at ${url}`));
                    }
                  });
                });
              }))
                .then(() => {
                  // Check if window.render is a function
                  if (typeof window.render === 'function') {
                    window.ranScripts = true;

                    runState(); // Call runState() explicitly
                    handlePop();
                    resolve(); // Resolve the outer promise
                  } else {
                    reject(new Error('window.render is not a function'));
                  }
                })
                .catch(reject); // Reject the outer promise if any script fails to load
            } else {
              reject(new Error(`Failed to load preloader script at ${preloaderUrl}`));
            }
          });
        }
        });
      }


      // Usage example:
      loadScriptAndRunFunction(scriptUrls, preloaderUrl)
        .then(() => {

          window.removeLoader();


        })
        .catch(error => {
          console.error('Error loading script:', error);
        });

      //END MAIN PROMISE

    }

    preLoader(stateTag, stateTagPath, loadParams);


    function runState() {
      console.log("Running state...");
      console.log(loadParams);

      function stateParams(loadParams, tagParam) {

        //this resource is where the new schema from viewSchemas folder should come in
        const resource = schema[tagParam].customFunctions[tagParam].dataSchema;
        const resourceParent = schema[tagParam];

        if (resource && typeof resource === 'object' && Object.keys(resource).length > 0) {

          let result = { ...resource };

          if (resource.data) {

            for (let param in resource.data) {
              //param = resource.data[param];
              if (resource.data[param] == undefined) {
                result.data[param] = loadParams[param];

              }
            }
            // Update the original resource.data with the new values
            resource.data = result.data;

            resourceParent.customFunctions[tagParam].dataSchema = resource;
            console.log("customFuncitons by tagParam aka stateTag has been updated with dynamic data", resourceParent);


          }
          else {
            return resourceParent;

          }
          console.log(resourceParent);

          return resourceParent;
        }
        else {
          //console.log("no params");
          return resourceParent;
        }

      }


      function processState(stateTag, stateTagPath, loadParams, historyCount) {
        console.log(`Changing state to: ${stateTag}`);

        let tagParam = stateTag;
        let renderSchema = stateParams(loadParams, tagParam);
        
        return {
          stateTagName: stateTag,
          stateTagPath: stateTagPath,
          stateTagScripts: schema[stateTag].scripts,
          stateTagLoadParams: loadParams,
          stateTagParams: renderSchema,
          stateCount: historyCount
        };

      }
      function changeState(stateTag, stateTagPath, loadParams, historyCount) {
        if(history.state && history.state.stateCount){

          historyCount = history.state.stateCount;
          historyCount++;
        }
      else{
           historyCount = window.historyCount;
          historyCount++
          
      }
        let buildState = processState(stateTag, stateTagPath, loadParams, historyCount);
        window.historyCount = buildState.stateCount;
        history.pushState(buildState, buildState.stateTagName, '/' + buildState.stateTagPath);

        renderView(buildState.stateTagParams);
      }

      changeState(stateTag, stateTagPath, loadParams, historyCount);


    }
    function handlePop() {
     

      window.addEventListener('popstate', event => {
        //console.log('popstate detected');
        if (event.state && renderComplete == 'true') {
          renderComplete = 'false';
          let popState = event.state;
          popState;
          historyCount = popState.stateCount;
          historyCount++;
          window.historyCount = historyCount;

          console.log(popState);
          history.replaceState(popState, popState.stateTagName, '/' + popState.stateTagPath);
          
          
          let sendStateData = popState.stateTagData;

              renderSchema = popState.stateTagParams;
              console.log(renderSchema);
              window.renderView(renderSchema);


        }
      });
    }

  }



  window.renderView = async function renderView(renderSchema) {
    console.log(renderSchema);

    await window.render(renderSchema);
    renderComplete = "true";
    window.renderComplete = renderComplete;
    if(window.originBurst && window.originBurst?.signalBurst === undefined){
      window.originBurst['signalBurst'] = {'origin': history.state.stateTagName, 'signal': 'load', 'signalResult':undefined};
    }

  }


  //test from here
  window.signalBurst = function signalBurst(signalObject, signalFunction, signalResult) {
    signalResult = signalResult;
    if (signalObject === undefined) {
        return;
    }
   
    if(signalResult === undefined){
      signalResult = window.originBurst?.signalBurst?.signalResult;
    }
    if(window.originBurst?.signalBurst !== undefined){
    
     
      history.state['signalBurst'] = {'origin': history.state.stateTagName, 'signal': signalObject, 'signalResult':signalResult};
      window.originBurst.signalBurst= {'origin': history.state.stateTagName, 'signal': signalObject, 'signalResult':signalResult};

    }else{
      history.state['signalBurst'] = {'origin': history.state.stateTagName, 'signal': signalObject, 'signalResult': signalResult};
      window.originBurst['signalBurst']= {'origin': history.state.stateTagName, 'signal': signalObject, 'signalResult':signalResult};
    }

    if (Array.isArray(signalFunction) && signalFunction.length > 1) {
        let promiseChain = Promise.resolve();

        signalFunction.forEach(function (element) {
            promiseChain = promiseChain.then(function () {
                if (typeof window[element] === 'function') {
                    return window[element](); // Call the function if it's indeed a function
                } else {
                    console.error('signalBurst: No such function', element);
                }
            });
        });

    } else {
        if (typeof window[signalFunction] === 'function') {
            window[signalFunction]();
        } else {
            console.error('signalBurst: No such function', signalFunction);
        }
    }
}


  window.getSignal = function getSignal(signalSend){
    if(window.originBurst?.signalBurst === undefined){
      
      signalSend = undefined;
    }else{
        signalSend = window.originBurst.signalBurst
        history.state.signalBurst=signalSend;
    }
    return signalSend;
  }





  //end test here


  window.stateDefine = stateDefine;
  window.runState = stateDefine;
  window.changeState = stateDefine;
  //console.log("State definition completed.");
