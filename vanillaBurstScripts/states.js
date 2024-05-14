let ranScripts = false;

let historyCount = 0;
window.historyCount = historyCount;
newRequest = false;
window.newRequest = newRequest;

window.frozenVanilla(
  "stateDefine",
  async function (
    stateTag,
    stateTagPath,
    loadParams,
    historyCount,
    originBurst
  ) {
    let renderSchema;
    if (!originBurst) {
      originBurst = {};
    }

    //console.log(`Defining state: ${stateTag}`);

    loadParams;
    let currentState = {};
    let stateBurst = JSON.parse(localStorage.getItem("stateBurst")) || [];

    originBurst =
      originBurst || JSON.parse(localStorahe.getItem("originBurst"));
    stateTag = stateTag || stateBurst[0] || null;
    stateTagPath = stateTagPath || stateBurst[1] || null;
    loadParams = loadParams || stateBurst[2] || null;

    function storeView(stateTag) {
      //approach to take to fetch already loaded views for quick render
      //return storepath + stateTag + '.js';
    }

    function stateScripts(
      stateTag,
      stateTagPath,
      loadParams,
      historyCount,
      originBurst
    ) {
      console.log(`Preloading state: ${stateTag}`);

      const scriptUrls = window.schema[stateTag].scripts;
      const preloaderUrl = window.schema[stateTag].preloader;
      const nonceString2 = window.nonceBack(); // Fetch nonceString2 once
      function loadScript(url, nonceString2) {
        return new Promise((resolve, reject) => {
          let script = document.querySelector(`script[src="${url}"]`);
          if (script) {
            document.head.removeChild(script);
          }
          script = document.createElement("script");
          script.src = url;
          script.type = "text/javascript";
          script.setAttribute("name", "burst");
          script.setAttribute("nonce", nonceString2);
          script.onload = () => resolve(script);
          script.onerror = () =>
            reject(new Error(`Failed to load script at ${url}`));
          document.head.appendChild(script);
        });
      }

      function addScriptToHead(url, nonceString2) {
        let script = document.querySelector(`script[src="${url}"]`);
        if (script) {
          document.head.removeChild(script);
        }
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.setAttribute("nonce", nonceString2);
        document.head.appendChild(script);
      }

      function loadScriptAndRunFunction(
        scriptUrls,
        preloaderUrl,
        nonceString2
      ) {
        return loadScript(preloaderUrl, nonceString2)
          .then(() => {
            addScriptToHead(preloaderUrl, nonceString2);
            window.preloaderAnimation();
            return Promise.all(
              scriptUrls.map((url) =>
                loadScript(url, nonceString2).then(() =>
                  addScriptToHead(url, nonceString2)
                )
              )
            );
          })
          .then(() => {
            if (typeof window.render === "function") {
              return true;
            }
          })
          .catch((error) => {
            throw error;
          });
      }

      loadScriptAndRunFunction(scriptUrls, preloaderUrl, nonceString2)
        .then(() => {
          runState();
          handlePop();
          window.removeLoader();
        })
        .catch((error) => {
          console.error("Error loading script:", error);
          return Promise.reject(error); // Reject the promise
        });
    }
    stateScripts(stateTag, stateTagPath, loadParams, historyCount, originBurst);

    function runState() {
      console.log("Running state...");
      console.log(loadParams);

      function stateParams(loadParams, tagParam) {
        //this resource is where the new schema from viewSchemas folder should come in
        const resource =
          window.schema?.[tagParam]?.customFunctions?.[tagParam]?.dataSchema ||
          undefined;
        const resourceParent = window.schema[tagParam];

        if (
          resource &&
          typeof resource === "object" &&
          Object.keys(resource).length > 0
        ) {
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
            console.log(
              "customFuncitons by tagParam aka stateTag has been updated with dynamic data",
              resourceParent
            );
          } else {
            return resourceParent;
          }
          console.log(resourceParent);

          return resourceParent;
        } else {
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
          stateTagScripts: window.schema[stateTag].scripts,
          stateTagLoadParams: loadParams,
          stateTagParams: renderSchema,
          stateCount: historyCount,
        };
      }
      function changeState(stateTag, stateTagPath, loadParams, historyCount) {
        if (history.state && history.state.stateCount) {
          historyCount = history.state.stateCount;
          historyCount++;
        } else {
          historyCount = window.historyCount;
          historyCount++;
        }
        let buildState = processState(
          stateTag,
          stateTagPath,
          loadParams,
          historyCount
        );
        window.historyCount = buildState.stateCount;

        history.pushState(
          buildState,
          buildState.stateTagName,
          "/" + buildState.stateTagPath
        );

        window.render(buildState.stateTagParams);
      }
      changeState(
        stateTag,
        stateTagPath,
        loadParams,
        historyCount,
        originBurst
      );
    }
    function handlePop() {
      window.addEventListener("popstate", (event) => {
        //console.log('popstate detected');
        renderComplete = window.renderComplete;
        if (event.state && renderComplete === true) {
          renderComplete = "false";
          let popState = event.state;
          popState;
          historyCount = popState.stateCount;
          historyCount++;
          window.historyCount = historyCount;

          console.log(popState);
          history.replaceState(
            popState,
            popState.stateTagName,
            "/" + popState.stateTagPath
          );

          let sendStateData = popState.stateTagData;

          renderSchema = popState.stateTagParams;
          console.log(renderSchema);

          window.render(renderSchema);
        }
      });
    }
  }
);

window.frozenVanilla("myState", function (stateBurst) {
  // Check if stateBurst exists in localStorage
  if (history.state.stateTagName !== stateBurst[0]) {
    localStorage.setItem("stateBurst", JSON.stringify(stateBurst));
    window.stateDefine();
  }
});
