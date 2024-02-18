
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
  //schema = window.schema;



  function storeView(stateTag) {
    //approach to take to fetch already loaded views for quick render
    //return storepath + stateTag + '.js';

  };

  function preLoader(stateTag, stateTagPath, loadParams) {


    console.log(`Preloading state: ${stateTag}`);

    const scriptUrls =  window.schema[stateTag].scripts;
    // TODO const externalScriptUrls = schema[stateTag].externalScriptUrls;
    const preloaderUrl = window.schema[stateTag].preloader;



    //MAIN PROMISE
    function loadScriptAndRunFunction(scriptUrls, preloaderUrl) {
      
      // Function to add script to the document's head
      function addScriptToHead(url) {
        // Check if the script tag with the given URL already exists

        // Create and append the script tag to the head
        if (!window.ranScripts || window.ranScripts === false) {
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

        if (window.ranScripts === true) {
          runState(); // Call runState() explicitly

        } else {

          function loadScript(url) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = url;
                script.onload = () => resolve(script);
                script.onerror = () => reject(new Error(`Failed to load script at ${url}`));
                document.head.appendChild(script);
            });
        }
        
        function addScriptToHead(url) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            document.head.appendChild(script);
        }
        
        loadScript(preloaderUrl)
            .then(() => {
                addScriptToHead(preloaderUrl);
                window.preloaderAnimation();
        
                // Then, load the other scripts
                return Promise.all(scriptUrls.map(url => loadScript(url).then(() => addScriptToHead(url))));
            })
            .then(() => {
                if (typeof window.render === 'function') {
                    window.ranScripts = true;
                    runState(); // Call runState() explicitly
                    handlePop();
                } else {
                    throw new Error('window.render is not a function');
                }
            })
            .catch(error => {
                console.error(error.message);
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
      const resource =  window.schema[tagParam].customFunctions[tagParam].dataSchema;
      const resourceParent =  window.schema[tagParam];

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
        stateTagScripts:  window.schema[stateTag].scripts,
        stateTagLoadParams: loadParams,
        stateTagParams: renderSchema,
        stateCount: historyCount
      };

    }
    function changeState(stateTag, stateTagPath, loadParams, historyCount) {
      if (history.state && history.state.stateCount) {

        historyCount = history.state.stateCount;
        historyCount++;
      }
      else {
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
  if (window.originBurst && window.originBurst?.signalBurst === undefined) {
    window.originBurst['signalBurst'] = { [history.state.stateTagName]: { 'origin': history.state.stateTagName, 'signal': 'load', 'signalResult': undefined } }
    // history.state['signalBurst'] = {[history.state.stateTagName]:{'origin': history.state.stateTagName, 'signal': 'load', 'signalResult':undefined}}
  }
 

}  

window.freezeSchema = async function freezeSchema(){


await window.appShellReady

if(window.appShellReady === undefined){

}
else{
  Object.keys(renderSchema).forEach(key => {
           Object.defineProperty(window, key, {
               value: renderSchema[key],
               writable: false,
               configurable: false
           });
       });
       window.deepFreeze(renderSchema)

}
}


//end test here


window.stateDefine = stateDefine;
window.runState = stateDefine;
window.changeState = stateDefine;
//console.log("State definition completed.");
