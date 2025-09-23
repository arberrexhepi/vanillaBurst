/**
 * Asynchronously renders the application based on the provided schema.
 *
 * @param {Object} renderSchema - The schema defining the views and functions to render.
 * @param {Object} originBurst - The initial state to be passed to the functions.
 * @global
 *
 * @description
 * The render function initializes the rendering process based on the provided schema.
 * It iterates over the customFunctions defined in the renderSchema and executes those
 * marked with the role "rollCall" and render mode "burst". It leverages the childFunction
 * to perform the actual rendering logic.
 *
 * @throws {Error} If an error occurs during the rendering process, it is logged to the console.
 * @throws {ConsoleWarning} If the renderSchema is not provided, a warning is logged to the console.
 */
ë.frozenVanilla("render", async function render(renderSchema, vanillaPromise) {
  if (!renderSchema) {
    console.warn("There are no views defined in this app");
    return;
  }
  ë.logSpacer();
  ë.logSpacer(
    "%c[Render Started]",
    "",
    "color: white; font-weight: bold; font-size:24px;",
    true
  );

  let originBurst = JSON.parse(localStorage.getItem("originBurst"));

  if (!originBurst) {
    originBurst = {};

    ë.logSpacer(
      "Initializing originBurst entry: originBurst = {}",
      null,
      null,
      true
    );
  } else {
    ë.logSpacer(
      "Initializing originBurst Entry: Cache found",
      null,
      null,
      true
    );
  }

  initializeLocalStorage();

  // for (let script of renderSchema.scripts) {
  //   ë.loadScript(script);
  // }

  const runRoll = true;
  const rollCall = Object.keys(renderSchema.customFunctions);
  ë.runRoll = "rollBurst";

  const containers = collectContainers(rollCall, renderSchema);
  localStorage.setItem("containers", JSON.stringify(containers));
  let landingReference;
  try {
    const vanillaPromises = await ë.childFunction(
      renderSchema,
      rollCall,
      runRoll,
      originBurst,
      vanillaPromise
    );

    const loadedContainers = JSON.parse(localStorage.getItem("containers"));
    if (!loadedContainers) {
      throw new Error("No containers found in localStorage");
    }
    if (loadedContainers) {
      //IMPROVE THE FOLLOWING BY ADDING THE INFORMATION OF WHETHER TO CHECK FOR THIS in childFunciton.js because right now it doesnt know if the namespace scope requires this component at loading

      const promises = loadedContainers.map(
        (container) =>
          new Promise((resolve) => {
            const checkExist = setInterval(() => {
              if (
                document.getElementById(container) ||
                document.querySelector(`.${container}`)
              ) {
                clearInterval(checkExist);
                resolve();
              } else {
                clearInterval(checkExist);
                resolve();
              }
            }, 10);
          })
      );
      await Promise.all(promises);

      ë.logSpacer(
        "%c[Executing JavaScript!]",
        "",
        "color: white; font-weight: bold; font-size:24px;"
      );

      for (const customFunctionName of rollCall) {
        landingReference = customFunctionName;
        try {
          let thisSB =
            vanillaPromises?.[customFunctionName]?.signalBurst?.[
              vanillaPromises?.[customFunctionName]?.renderSchema?.landing
            ]?.[customFunctionName] || null;

          if (thisSB && thisSB.name && thisSB.init) {
            if (!ë.intervalStore.get(thisSB.name)) {
              ë.logSpacer("Registering signal as runner: " + thisSB.name);

              ë.intervalStore(thisSB.name, {
                [thisSB.name + "_runner"]: function (thisVanillaPromise) {
                  ë.vanillaSignal({
                    vanillaPromise: thisVanillaPromise,
                    signalName: thisSB?.name,
                    namespace: thisSB?.namespace ? thisSB?.namespace : null, //this will only run in the namespaces in the config myweatherConfig.js
                    action: thisSB?.action,
                    onEvent: thisSB?.onEvent,
                    vanillaDOM: thisSB?.vanillaDOM,
                    init: thisSB?.init ? thisSB.init : null, ///in
                    count: thisSB?.count ? thisSB.count : null,
                    time: thisSB?.time ? thisSB.time : null,
                    repeat: thisSB?.repeat ? thisSB.repeat : null,
                    intermittent: thisSB?.intermittent
                      ? thisSB.intermittent
                      : null,
                    callBack: thisSB?.callBack ? thisSB.callBack : null,
                    clearable: thisSB.clearable, ///clear conditional function
                    affectors: thisSB.affectors,
                  });
                },
              });
            }
          }
          try {
            let componentList =
              vanillaPromises[customFunctionName].componentList;

            // Remove duplicates by converting to a Set and then back to an array

            ë.signalStore.setAllowedCaller(ë.vanillaAccessor);

            vanillaPromises[customFunctionName].componentList = [
              ...new Set(componentList),
            ];
            //alert(vanillaPromises[customFunctionName].componentList);
            // Part 1: Load all component JS files
            const loadScriptsPromises = vanillaPromises[
              customFunctionName
            ].componentList.map(async (componentJS) => {
              return loadScript(
                `${ë.fullPath}client/components/${componentJS}/${componentJS}.js`
              );
            });

            let runningComponent;
            Promise.all(loadScriptsPromises)
              .then(() => {
                ë.logSpacer("The component list: " + componentList);
                // Part 2: After loading all scripts, call each component function
                const callComponentFunctions = vanillaPromises[
                  customFunctionName
                ].componentList.map(async (componentJS) => {
                  ë.logSpacer(
                    "trying to run {componentName}.js " + componentJS
                  );
                  runningComponent = componentJS;
                  try {
                    await ë[componentJS](vanillaPromises[customFunctionName]); // Return the promise from each component function call
                    await ë[`${componentJS}Component`](
                      null,
                      vanillaPromises[customFunctionName]
                    );
                  } catch {
                    throw new Error(
                      "JS File reference or errors found at: " + componentJS
                    );
                    return;
                  }
                });

                return Promise.all(callComponentFunctions);
              })
              .then(() => {
                // Part 3: After all component functions are called, run the custom function and storeBurst
                // localStorage.setItem(
                //   "checkVanillaPromise-TurnThisOffInProduction",
                //   JSON.stringify(vanillaPromises)
                // );
                ë.logSpacer(
                  "trying to run {customFunctionName}.js " + customFunctionName
                );
                try {
                  const checkSecretCookie = getCookie("secret");
                  if (!checkSecretCookie) {
                    const secret = ë.nonce();
                    const days = 1; // Define the number of days for the cookie to expire
                    const date = new Date();
                    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Set the expiration time
                    const expires = "expires=" + date.toUTCString();
                    const secure =
                      window.location.protocol === "https:" ? "Secure; " : "";
                    document.cookie =
                      "secret=" +
                      encodeURIComponent(secret) +
                      "; " +
                      expires +
                      "; path=/; " +
                      secure +
                      "SameSite=Strict";
                  }

                  function getCookie(name) {
                    const value = `; ${document.cookie}`;
                    const parts = value.split(`; ${name}=`);
                    if (parts.length === 2) {
                      return decodeURIComponent(parts.pop().split(";").shift());
                    }
                    return null;
                  }

                  const retrievedSecret = getCookie("secret");

                  if (retrievedSecret) {
                    vanillaPromises[customFunctionName]["secret"] =
                      retrievedSecret;
                    ë.signalStore.set(
                      customFunctionName,
                      vanillaPromises[customFunctionName]
                    );
                    ë.signalStore.set(
                      "signalStore",
                      vanillaPromises[customFunctionName]
                    );

                    if (
                      vanillaPromises[customFunctionName].renderSchema
                        .customFunctions[customFunctionName]?.namespace &&
                      vanillaPromises[
                        customFunctionName
                      ].renderSchema.customFunctions[
                        customFunctionName
                      ]?.namespace.includes(
                        vanillaPromises[customFunctionName].renderSchema.landing
                      )
                    ) {
                      ë[customFunctionName](
                        vanillaPromises[customFunctionName]
                      );

                      ë.storeBurst(vanillaPromises[customFunctionName]);
                    } else if (
                      vanillaPromises[customFunctionName].renderSchema
                        .customFunctions[customFunctionName]?.namespace ===
                      undefined
                    ) {
                      ë[customFunctionName](
                        vanillaPromises[customFunctionName]
                      );

                      ë.storeBurst(vanillaPromises[customFunctionName]);
                    }
                  } else {
                    console.error("Failed to retrieve the secret cookie.");
                  }
                } catch (error) {
                  console.error(
                    "Error at : " + customFunctionName + " :" + error.message
                  );
                }
              });
            // .catch((error) => {
            //   console.error(
            //     "An error occurred during the promise chain execution for " +
            //       runningComponent +
            //       ":",
            //     error
            //   );
            // });
          } catch {
            ë.vanillaMess(
              `[${customFunctionName}.js]`,
              [ë[customFunctionName], ë.storeBurst],
              "array"
            );
          }

          if (thisSB?.name && thisSB.init) {
            let signalName = thisSB.name;
            let thisVanillaPromise = vanillaPromises[customFunctionName];

            try {
              ë.intervalStore
                .get(signalName)
                [`${signalName}_runner`](thisVanillaPromise);
            } catch (error) {
              console.error(
                "Error starting signal runner for " + signalName,
                error
              );
            }
          }
        } catch (error) {
          ë.vanillaMess("render", error, "checking");
          throw new Error(
            "JS File reference or errors found at: " + landingReference
          );
        }
      }
      let seo =
        vanillaPromises[renderSchema.landing].renderSchema.customFunctions[
          renderSchema.landing
        ].seo;

      ë.setSeo(seo);
      ë.renderComplete = true;

      let checkTimeSignal = ë.getSignal("timeSignal");
      if (checkTimeSignal.id) {
        ë.vanillaSignal({ signalName: "timeSignal", action: "go" });
      } else {
        ë.vanillaSignal({ signalName: "timeSignal", action: "go" });
      }
      ë.logSpacer("Here is your landing Schema:", vanillaPromises);

      console.log(
        "%c🍦🎉 vanillaBurst COMPLETE 🎉🍦",
        "color: #F3E5AB; font-weight: bold; font-size: 30px; background-color: #333; padding: 10px; border-radius: 5px;"
      );
      localStorage.removeItem("stateBurst");
      // Object.values(vanillaPromises).forEach((value) => {
      //   ë.signalStore.set(`${value.landing}`, value);
      //   Object.values(value.renderSchema.customFunctions).forEach(
      //     (customFunction) => {
      //       ë.signalStore.set(`${customFunction.functionFile}`, customFunction);
      //     }
      //   );
      // });
    } else {
      throw new Error("No containers found in localStorage");
    }
  } catch (error) {
    console.error("An error occurred during:" + landingReference, error);
  }
});

/**
 * Initializes localStorage if required.
 */
function initializeLocalStorage() {
  if (!localStorage.getItem("stateBurst")) {
    localStorage.setItem("stateBurst", JSON.stringify([]));
  }
}

/**
 * Collects all containers from the renderSchema.
 *
 * @param {Array} rollCall - List of function names to execute for rendering.
 * @param {Object} renderSchema - The schema defining the views and functions to render.
 *
 * @returns {Array} - List of containers to be added in localStorage.
 */
function collectContainers(rollCall, renderSchema) {
  const containers = rollCall
    .filter((fn) =>
      renderSchema.customFunctions[fn].hasOwnProperty("container")
    )
    .map((fn) => renderSchema.customFunctions[fn].container);

  const componentsTargets = rollCall
    .filter((fn) =>
      renderSchema.customFunctions[fn].hasOwnProperty("components")
    )
    .flatMap((fn) =>
      Object.values(renderSchema.customFunctions[fn].components).map(
        (component) => component.container
      )
    );

  return [...containers, ...componentsTargets];
}
