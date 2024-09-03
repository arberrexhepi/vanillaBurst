const vanillaApp = ë.frozenVanilla(
  "vanillaApp",
  function vanillaApp() {
    ë.onload = function () {
      ë.frozenVanilla("path", ë.location.pathname.replace(/^\//, ""));
      const fullPath = ë.domainUrl + ë.baseUrl;
      console.log("fullpath" + fullPath);

      // Load initial scripts and manage promise chains
      const configScriptPath = "vanillaBurstScripts/system/configs/config.js";
      const finalPromiseChain = [];

      ë.frozenVanilla("configScriptPath", configScriptPath, false);

      ë.frozenVanilla("loadInitialScripts", async function () {
        try {
          const configResponse = await fetch(fullPath + "globals/config.json");
          if (!configResponse.ok) {
            throw new Error("Network response was not ok");
          }

          const config = await configResponse.json();
          setVanillaBurstScripts(fullPath);
          // Assuming configScriptPath is defined and refers to the script to load
          await ë.loadScript(`${fullPath}${configScriptPath}`);

          // Process the config and return schemaParts
          const schemaParts = await ë.loadConfig(config);

          ë.logSpacer(
            `%cWelcome to ${ë.domainUrl} 🍦`,
            null,
            "color: #F3E5AB; font-weight: bold; font-size: 30px; background-color: #333; padding: 10px; border-radius: 5px;"
          );

          return schemaParts;
        } catch (error) {
          console.error("Script loading error: ", error);
        }
      });

      async function promiseSchemaParts(schemaParts) {
        ë.logSpacer(
          "%c[Building vanillaApp schema]",
          "",
          "color: white; font-weight: bold; font-size:24px;"
        );
        ë.logSpacer();

        // Log ë.schemaParts to verify its contents
        ë.logSpacer("ë.schemaParts:", schemaParts);

        const parts = Object.keys(schemaParts);
        console.log(parts);
        // Log parts to verify the extracted keys
        ë.logSpacer("Extracted parts (keys):", parts);

        ë.frozenVanilla("parts", parts, false);
        ë.logSpacer("Extracted parts (keys):", parts, null, true);

        const scriptPromises = parts.map((part) => {
          const partConfigPath = `schemas/${part}Config.js`;
          const scriptUrl = `${fullPath}${partConfigPath}`;
          alert(scriptUrl);

          ë.frozenVanilla("partConfigPath", partConfigPath, false);
          ë.frozenVanilla("scriptUrl", scriptUrl, false);
          return ë.loadScript(scriptUrl).catch((error) => {
            console.error(
              `Error loading [view]Config for part: ${part}`,
              error
            );
          });
        });

        const schemaScriptPath = `${fullPath}vanillaBurstScripts/schema.js`;
        ë.frozenVanilla("schemaScriptPath", schemaScriptPath, false);

        scriptPromises.push(
          ë.loadScript(schemaScriptPath).catch((error) => {
            console.error("Error loading schema.js script", error);
          })
        );

        return Promise.all(scriptPromises)
          .then(async () => {
            ë.logSpacer("CONFIG PARTS PROMISED:", parts, null, true);
            const schema = await config(parts);
            ë.frozenVanilla("schema", schema, false);

            if (config && typeof config === "function") {
              return await promiseRouteAndStateLoad(schema);
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
        await schema;
        return ë
          .loadScript(`${fullPath}${scriptPaths.vanillaBurstScriptPath}`)
          .then(
            async () =>
              await ë.loadScript(`${fullPath}${scriptPaths.routesScriptPath}`)
          )
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
      function setVanillaBurstScripts(fullPath) {
        if (ë.vanillaBurstScripts === undefined) {
          Object.defineProperty(window, "vanillaBurstScripts", {
            value: () => {
              ë.logSpacer(
                "Added vendors to renderSchema scripts:",
                ë.frozenVanilla.get("vendorConfig")
              );

              const vendorConfig = ë.frozenVanilla.get("vendorConfig");
              const vendorArray = Array.isArray(vendorConfig)
                ? vendorConfig.map((vendor) => `${fullPath}vendors/${vendor}`)
                : [];

              return Object.freeze([
                ...vendorArray,
                fullPath + "vendors/purify.min.js",
                fullPath +
                  "vanillaBurstScripts/vanillaDOM/processors/sanitizeVanillaDOM.js",
                fullPath +
                  "vanillaBurstScripts/vanillaDOM/processors/signalBurstDOM.js",
                fullPath +
                  "vanillaBurstScripts/vanillaDOM/processors/cssFileLoader.js",
                fullPath +
                  "vanillaBurstScripts/vanillaDOM/processors/htmlFileLoader.js",
                fullPath + "vanillaBurstScripts/vanillaDOM/updateComponent.js",
                fullPath +
                  "vanillaBurstScripts/vanillaDOM/vanillaComponents.js",
                fullPath + "vanillaBurstScripts/vanillaDOM/domBuild.js",
                fullPath + "vanillaBurstScripts/vanillaDOM/domPromises.js",
                fullPath + "vanillaBurstScripts/serverRender.js",
                fullPath +
                  "vanillaBurstScripts/functionPromises/vanillaPromise.js",
                fullPath +
                  "vanillaBurstScripts/functionPromises/appendScript.js",
                fullPath + "vanillaBurstScripts/singlePromise.js",
                fullPath + "vanillaBurstScripts/originBurst.js",
                fullPath + "vanillaBurstScripts/childFunction.js",
                /////signals
                fullPath + "vanillaBurstScripts/signals/getSignal.js",
                fullPath + "vanillaBurstScripts/signals/resetSignal.js",
                fullPath + "vanillaBurstScripts/signals/simpleSignal.js",
                fullPath + "vanillaBurstScripts/signals/signalInterval.js",
                fullPath + "vanillaBurstScripts/signals/one.js",
                fullPath + "vanillaBurstScripts/signals/vanillaSignal.js",
                fullPath + "vanillaBurstScripts/signals.js",
                //////////
                fullPath + "vanillaBurstScripts/render.js",
              ]);
            },
            writable: false,
            configurable: false,
          });
        }
      }
      setVanillaBurstScripts(fullPath);
      // Start the promise chain
      ë.loadInitialScripts()
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

vanillaApp();
