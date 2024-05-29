const vanillaApp = ë.frozenVanilla(
  "vanillaApp",
  function vanillaApp(baseUrl) {
    ë.onload = function () {
      ë.frozenVanilla("path", ë.location.pathname.replace(/^\//, ""));

      // Load initial scripts and manage promise chains
      const configScriptPath = "globals/config.js";
      const finalPromiseChain = [];

      ë.frozenVanilla("configScriptPath", configScriptPath, false);

      ë.frozenVanilla("loadInitialScripts", function () {
        return Promise.all([ë.loadScript(`${baseUrl}${configScriptPath}`)])
          .then(() => {
            ë.logSpacer(
              `%cWelcome to ${ë.domainUrl} 🍦`,
              null,
              "color: #F3E5AB; font-weight: bold; font-size: 30px; background-color: #333; padding: 10px; border-radius: 5px;"
            );
            return ë.schemaParts;
          })
          .catch((error) => {
            console.error("Script loading error: ", error);
          });
      });

      function promiseSchemaParts() {
        ë.logSpacer(
          "%c[Building vanillaApp schema]",
          "",
          "color: white; font-weight: bold; font-size:24px;"
        );
        ë.logSpacer();
        const parts = Object.keys(ë.schemaParts);

        ë.frozenVanilla("parts", parts, false);
        ë.logSpacer("Extracted parts (keys):", parts, null, true);

        const scriptPromises = parts.map((part) => {
          const partConfigPath = `../schemas/${part}Config.js`;
          const scriptUrl = `${baseUrl}${partConfigPath}`;

          ë.frozenVanilla("partConfigPath", partConfigPath, false);
          ë.frozenVanilla("scriptUrl", scriptUrl, false);

          return ë.loadScript(scriptUrl).catch((error) => {
            console.error(
              `Error loading [view]Config for part: ${part}`,
              error
            );
          });
        });

        const schemaScriptPath = "vanillaBurstScripts/schema.js";
        ë.frozenVanilla("schemaScriptPath", schemaScriptPath, false);

        scriptPromises.push(
          ë.loadScript(`${baseUrl}${schemaScriptPath}`).catch((error) => {
            console.error("Error loading schema.js script", error);
          })
        );

        return Promise.all(scriptPromises)
          .then(() => {
            ë.logSpacer("CONFIG PARTS PROMISED:", parts, null, true);
            const schema = config();
            if (typeof config === "function") {
              ë.frozenVanilla("schema", schema);
              return promiseRouteAndStateLoad(schema);
            } else {
              console.error("ë.config is not a function.");
            }
          })
          .catch((error) => {
            console.error(
              "An error occurred during script loading or execution at schema build:",
              error
            );
          });
      }

      const scriptPaths = {
        stateScriptsPath: "vanillaBurstScripts/stateScripts.js",
        vanillaBurstScriptPath: "vanillaBurstScripts/vanillaBurst.js",
        routesScriptPath: "vanillaBurstScripts/routes.js",
      };

      Object.keys(scriptPaths).forEach((key) => {
        ë.frozenVanilla(key, scriptPaths[key], false);
      });

      async function promiseRouteAndStateLoad(schema) {
        return window
          .loadScript(`${baseUrl}${scriptPaths.vanillaBurstScriptPath}`)
          .then(() => ë.loadScript(`${baseUrl}${scriptPaths.routesScriptPath}`))
          .then(() => {
            ë.logSpacer(
              "State init Scripts vanillaBurst.js and routes.js loaded successfully."
            );
          })
          .catch((error) => {
            console.error(
              "Scripts vanillaBurst.js and routes.js could not be loaded at script.js:",
              error
            );
            throw error;
          });
      }

      // Freeze an array of scripts into vanillaBurstScripts
      if (ë.vanillaBurstScripts === undefined) {
        Object.defineProperty(window, "vanillaBurstScripts", {
          value: Object.freeze([
            baseUrl + "vendors/jquery-3.7.1.min.js",
            baseUrl + "vendors/purify.min.js",
            baseUrl + "globals/config.js",
            baseUrl +
              "vanillaBurstScripts/vanillaDOM/processors/sanitizeVanillaDOM.js",
            baseUrl +
              "vanillaBurstScripts/vanillaDOM/processors/signalBurstDOM.js",
            baseUrl +
              "vanillaBurstScripts/vanillaDOM/processors/cssFileLoader.js",
            baseUrl +
              "vanillaBurstScripts/vanillaDOM/processors/htmlFileLoader.js",
            baseUrl + "vanillaBurstScripts/vanillaDOM/updateComponent.js",
            baseUrl + "vanillaBurstScripts/vanillaDOM/vanillaComponents.js",
            baseUrl + "vanillaBurstScripts/vanillaDOM/domBuild.js",
            baseUrl + "vanillaBurstScripts/vanillaDOM/domPromises.js",
            baseUrl + "vanillaBurstScripts/serverRender.js",
            baseUrl + "vanillaBurstScripts/functionPromises/vanillaPromise.js",
            baseUrl + "vanillaBurstScripts/functionPromises/appendScript.js",
            baseUrl + "vanillaBurstScripts/singlePromise.js",
            baseUrl + "vanillaBurstScripts/originBurst.js",
            baseUrl + "vanillaBurstScripts/childFunction.js",
            baseUrl + "vanillaBurstScripts/signals.js",
            baseUrl + "vanillaBurstScripts/render.js",
          ]),
          writable: false,
          configurable: false,
        });
      }

      // Start the promise chain
      window
        .loadInitialScripts()
        .then((schemaParts) => {
          return promiseSchemaParts(schemaParts);
        })
        .catch((error) => {
          console.error("Error in initial script loading:", error);
        });
    };
  },
  false
);

vanillaApp(baseUrl);
