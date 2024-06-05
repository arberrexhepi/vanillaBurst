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
      let signals = JSON.parse(localStorage.getItem("signals"));

      if (signals) {
        for (let signalName in signals) {
          ë.unregisterSignal(signalName);
        }
      }

      ë.renderComplete = false;
      ë.logSpacer(
        `%c[Changing state to: ${stateTag}]`,
        "",
        "color: white; font-weight: bold; font-size:24px;",
        true
      );

      if (loadParams === null) {
        ë.logSpacer(
          "State will run with default loadParam: {}",
          null,
          null,
          true
        );
      } else {
        ë.logSpacer(
          "State will run with passed loadParam: " + JSON.stringify(loadParams),
          null,
          null,
          true
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
            ë.logSpacer(
              "customFunctions by tagParam (stateTag) have been updated with dynamic data",
              resourceParent,
              null,
              true
            );
          } else {
            return resourceParent;
          }

          ë.logSpacer(resourceParent, null, null, true);
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
        ë.logSpacer("Setting SEO:", JSON.stringify(seo), null, true);
        ë.logSpacer("Document title set to:", seo.title, null, true);

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

          ë.logSpacer(popState, null, null, true);
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
