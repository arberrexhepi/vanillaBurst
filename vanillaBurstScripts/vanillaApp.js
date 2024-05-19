const vanillaApp = window.frozenVanilla(
  "vanillaApp",
  function vanillaApp(baseUrl) {
    window.onload = function () {
      window.frozenVanilla("path", window.location.pathname.replace(/^\//, ""));

      // Helper function: load a single script
      window.frozenVanilla("loadScript", function loadScript(url) {
        return new Promise((resolve, reject) => {
          const script = document.createElement("script");
          const nonceString = window.nonceBack();

          script.src = url;
          script.setAttribute("name", "init");
          script.setAttribute("nonce", nonceString);
          script.onload = () => resolve(script);
          script.onerror = () =>
            reject(new Error(`Failed to load script: ${url}`));

          document.head.appendChild(script);
        });
      });

      // Load initial scripts and manage promise chains
      const configScriptPath = "globals/config.js";
      const finalPromiseChain = [];

      window.frozenVanilla("configScriptPath", configScriptPath, false);

      window.frozenVanilla("loadInitialScripts", function () {
        return Promise.all([window.loadScript(`${baseUrl}${configScriptPath}`)])
          .then(() => {
            console.log(
              `%cWelcome to ${window.domainUrl} 🍦`,
              "color: #F3E5AB; font-weight: bold; font-size: 30px; background-color: #333; padding: 10px; border-radius: 5px;"
            );
            return window.schemaParts;
          })
          .catch((error) => {
            console.error("Script loading error: ", error);
          });
      });

      function promiseSchemaParts() {
        window.logSpacer();

        console.log(
          "%c[Building vanillaApp schema]",
          "color: white; font-weight: bold; font-size:24px;"
        );
        window.logSpacer();
        const parts = Object.keys(window.schemaParts);

        window.frozenVanilla("parts", parts, false);
        console.log("Extracted parts (keys):", parts);

        const scriptPromises = parts.map((part) => {
          const partConfigPath = `../schemas/${part}Config.js`;
          const scriptUrl = `${baseUrl}${partConfigPath}`;

          window.frozenVanilla("partConfigPath", partConfigPath, false);
          window.frozenVanilla("scriptUrl", scriptUrl, false);

          return window.loadScript(scriptUrl).catch((error) => {
            console.error(
              `Error loading [view]Config for part: ${part}`,
              error
            );
          });
        });

        const schemaScriptPath = "vanillaBurstScripts/schema.js";
        window.frozenVanilla("schemaScriptPath", schemaScriptPath, false);

        scriptPromises.push(
          window.loadScript(`${baseUrl}${schemaScriptPath}`).catch((error) => {
            console.error("Error loading schema.js script", error);
          })
        );

        return Promise.all(scriptPromises)
          .then(() => {
            console.info("CONFIG PARTS PROMISED:", parts);
            const schema = config();
            if (typeof config === "function") {
              window.frozenVanilla("schema", schema);
              return promiseRouteAndStateLoad(schema);
            } else {
              console.error("window.config is not a function.");
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
        window.frozenVanilla(key, scriptPaths[key], false);
      });

      async function promiseRouteAndStateLoad(schema) {
        return window
          .loadScript(`${baseUrl}${scriptPaths.vanillaBurstScriptPath}`)
          .then(() =>
            window.loadScript(`${baseUrl}${scriptPaths.routesScriptPath}`)
          )
          .then(() => {
            console.log(
              "Scripts vanillaBurst.js and routes.js loaded successfully."
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
      if (window.vanillaBurstScripts === undefined) {
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
