let historyCount = 0;
ë.historyCount = historyCount;

ë.frozenVanilla(
  "vanillaBurst",
  async function (
    stateTag,
    stateTagPath,
    loadParams,
    historyCount,
    originBurst
  ) {
    let renderSchema;
    originBurst =
      JSON.parse(localStorage.getItem("originBurst")) || originBurst || {};

    // Initialize state, stateBurst, and local storage data
    let currentState = {};
    let stateBurst = JSON.parse(localStorage.getItem("stateBurst")) || [];
    stateTag = stateTag || stateBurst[0] || null;
    stateTagPath = stateTagPath || stateBurst[1] || null;
    loadParams = loadParams || stateBurst[2] || null;

    // Load scripts for the state
    let loadedScripts = {};

    function stateScripts(stateTag) {
      const { scripts: scriptUrls, preloader: preloaderUrl } =
        ë.schema[stateTag];
      const nonceString2 = ë.nonceBack();

      // function loadScript(url) {
      //   return new Promise((resolve, reject) => {
      //     const version = "v1.0.0.1";
      //     const urlWithVersion = `${url}?version=${version}`;

      //     // Check if a script with the same src attribute already exists
      //     const existingScript = document.head.querySelector(
      //       `script[src="${urlWithVersion}"]`
      //     );
      //     if (existingScript) {
      //       let nonceString = ë.nonceBack(); // Generate a new nonce
      //       existingScript.setAttribute("nonce", nonceString); // Update the nonce of the existing script
      //       resolve(existingScript);
      //       return;
      //     }

      //     let script = document.createElement("script");
      //     script.src = urlWithVersion;
      //     script.type = "text/javascript";
      //     script.setAttribute("nonce", ë.nonceBack());

      //     script.onload = () => resolve(script);
      //     script.onerror = () =>
      //       reject(new Error(`Script load error for ${url}`));
      //     document.head.appendChild(script);
      //   });
      // }

      function loadScriptAndRunFunction() {
        return ë
          .loadScript(preloaderUrl)
          .then(() => {
            return Promise.all(scriptUrls.map((url) => loadScript(url)));
          })
          .then(() => {
            ë.preloaderAnimation();
            if (typeof ë.render === "function") {
              return true;
            }
          })
          .catch((error) => {
            throw error;
          });
      }

      loadScriptAndRunFunction()
        .then(() => {
          runState();
          handlePop();
          ë.removeLoader();
        })
        .catch((error) => {
          console.error("Error loading scripts:", error);
          return Promise.reject(error);
        });
    }

    // Execute the state scripts
    stateScripts(stateTag);

    function runState() {
      let intervals = JSON.parse(localStorage.getItem("intervals"));

      if (intervals) {
        for (let signalName in intervals) {
          ë.unregisterInterval(signalName);
        }
      }

      ë.renderComplete = false;
      ë.logSpacer();
      console.log(
        `%c[Changing state to: ${stateTag}]`,
        "color: white; font-weight: bold; font-size:24px;"
      );
      if (loadParams === null) {
        console.log("State will run with default loadParam: {}");
      } else {
        console.log(
          "State will run with passed loadParam: " + JSON.stringify(loadParams)
        );
      }

      function stateParams(loadParams, tagParam) {
        const resource =
          ë.schema?.[tagParam]?.customFunctions?.[tagParam]?.dataSchema;
        const resourceParent = ë.schema[tagParam];

        if (
          resource &&
          typeof resource === "object" &&
          Object.keys(resource).length > 0
        ) {
          let result = { ...resource };

          if (resource.data) {
            for (let param in resource.data) {
              if (resource.data[param] === undefined) {
                result.data[param] = loadParams[param];
              }
            }
            resource.data = result.data;
            resourceParent.customFunctions[tagParam].dataSchema = resource;
            console.log(
              "customFunctions by tagParam (stateTag) have been updated with dynamic data",
              resourceParent
            );
          } else {
            return resourceParent;
          }

          console.log(resourceParent);
          return resourceParent;
        } else {
          return resourceParent;
        }
      }

      function processState() {
        let renderSchema = stateParams(loadParams, stateTag);

        return {
          stateTagName: stateTag,
          stateTagPath: stateTagPath,
          stateTagScripts: ë.schema[stateTag].scripts,
          stateTagLoadParams: loadParams,
          stateTagParams: renderSchema,
          stateCount: historyCount,
        };
      }

      function changeState() {
        historyCount = history.state?.stateCount || ë.historyCount;
        historyCount++;

        let buildState = processState();

        ë.historyCount = buildState.stateCount;
        history.pushState(
          buildState,
          buildState.stateTagName,
          `/${buildState.stateTagPath}`
        );
        let seo = ë.seo;

        ë.setSeo(seo);
        console.log("Setting SEO:", seo);
        console.log("Document title set to:", seo.title);

        ë.render(buildState.stateTagParams);
      }

      changeState();
    }

    // Handle popstate events for navigation
    function handlePop() {
      ë.addEventListener("popstate", (event) => {
        if (event.state && ë.renderComplete === true) {
          ë.renderComplete = false;
          let popState = event.state;
          historyCount = popState.stateCount + 1;
          ë.historyCount = historyCount;

          console.log(popState);
          history.replaceState(
            popState,
            popState.stateTagName,
            `/${popState.stateTagPath}`
          );
          let seo = ë.seo;

          ë.setSeo(seo);
          ë.render(popState.stateTagParams);
        }
      });
    }
  }
);

ë.frozenVanilla("myState", function (stateBurst) {
  if (history.state.stateTagName !== stateBurst[0]) {
    localStorage.setItem("stateBurst", JSON.stringify(stateBurst));
    ë.vanillaBurst();
  }
});
