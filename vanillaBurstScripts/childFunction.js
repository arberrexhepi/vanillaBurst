/**
 * Processes and runs the functions defined in the renderSchema based on the provided rollCall.
 *
 * @param {Object} renderSchema - The schema defining the views and functions to render.
 * @param {Array} rollCall - The list of functions to run for the view.
 * @param {Boolean} runRoll - Flag indicating whether to run the roll call.
 * @param {Object} originBurst - The initial state to be passed to the functions.
 * @returns {Promise<Object>} A promise that resolves with the processed function promises.
 * @global
 *
 * @description
 * The childFunction loads and executes custom functions defined in the renderSchema.
 * It manages asynchronous operations, processes function data, and updates the originBurst state.
 */
ë.frozenVanilla(
  "childFunction",
  async function (renderSchema, rollCall, runRoll, originBurst) {
    return new Promise((resolve, reject) => {
      ë.logSpacer();
      ë.logSpacer(
        "%c[Starting Promising renderSchema landing customFunctions]",
        "",
        "color: white; font-weight: bold; font-size:24px;",
        true
      );
      if (!runRoll || !Array.isArray(rollCall) || rollCall.length === 0) {
        resolve({});
        return;
      }

      arrayRoll(rollCall)
        .then((vanillaPromises) => resolve(vanillaPromises))
        .catch((error) => reject(error));
    });

    /**
     * Processes an array of function names, executing and resolving each.
     *
     * @param {Array} rollCall - The list of functions to run for the view.
     * @returns {Promise<Object>} A promise that resolves with the processed function promises.
     */
    async function arrayRoll(rollCall) {
      const maxCount = rollCall.length;
      let count = 0;
      let vanillaPromises = {};
      for (const element of rollCall) {
        //ë.logSpacer();
        ë.logSpacer(
          "%cPromising " + element,
          "",
          "color: white; font-weight: bold; font-size:18px;",
          true
        );
        count++;
        const passedFunction = renderSchema.customFunctions[element];
        const customFunctionName = passedFunction.functionFile;

        try {
          const updatedOriginBurst = await processFunction(
            passedFunction,
            customFunctionName
          );
          const serverResult =
            updatedOriginBurst?.[renderSchema.landing]?.[customFunctionName] ||
            null;

          const vanillaPromise = await ë.singlePromise(
            renderSchema,
            serverResult,
            passedFunction,
            updatedOriginBurst
          );
          //alert("at childFunction" + vanillaPromise);
          let signalBurst = await ë.storeBurst(vanillaPromise);
          if (!vanillaPromise?.signalBurst) {
            vanillaPromise["signalBurst"] = {};
          }
          vanillaPromise.signalBurst = signalBurst;
          vanillaPromises[customFunctionName] = vanillaPromise;

          if (typeof ë[customFunctionName] === "function") {
            ë.logSpacer(
              "%c" + customFunctionName + " has been successfully rendered.",
              "color: white; font-weight: bold; font-size:18px;",
              true
            );
          } else {
            ë.logSpacer(
              console.warn(
                "ë." +
                  customFunctionName +
                  " is not a function. HINT: Naming conflicts in files, or reference name exists as some other Global name such as a DIV element ID.",
                "",
                null,
                true
              )
            );
          }

          if (count >= maxCount) {
            ë.logSpacer(
              "%c[Completed Promising renderSchema landing customFunctions]",
              "",
              "color: white; font-weight: bold; font-size:24px;",
              true
            );
            return vanillaPromises;
          }
        } catch (error) {
          ë.logSpacer(console.error(error), null, null, true);
        }
      }
    }

    /**
     * Processes a single function and updates the originBurst state.
     *
     * @param {Object} passedFunction - The function definition from the renderSchema.
     * @param {String} customFunctionName - The name of the custom function to process.
     * @returns {Promise<Object>} A promise that resolves with the updated originBurst state.
     */
    async function processFunction(passedFunction, customFunctionName) {
      return new Promise(async (resolve) => {
        ë.logSpacer(
          {
            Status: "STARTING rollCall for customFunction",
            customFunctionName,
            passedFunction,
          },
          true
        );

        if (passedFunction) {
          originBurst =
            JSON.parse(localStorage.getItem("originBurst")) ||
            ë.updateOriginBurst(
              renderSchema,
              customFunctionName,
              passedFunction,
              originBurst
            );

          let serverResult = {};
          let promises = [];

          if (Array.isArray(passedFunction.dataSchema)) {
            let indexResult;
            for (const schema of passedFunction.dataSchema) {
              if (schema?.auto === true) {
                promises.push(
                  ë
                    .serverRender(schema, "serverBurst", true, indexResult)
                    .then((result) => {
                      indexResult = result;
                      return result;
                    })
                );
              }
            }
          } else if (passedFunction.dataSchema?.auto === true) {
            promises.push(
              ë
                .serverRender(passedFunction.dataSchema, "serverBurst")
                .then((result) => {
                  return result;
                })
            );
          }

          Promise.all(promises).then((results) => {
            console.log("complete serverResult: " + JSON.stringify(results));

            // Merge all objects from the results array into serverResult
            results.forEach((result) => {
              Object.assign(serverResult, result);
            });

            originBurst = ë.setOriginBurst(
              renderSchema,
              customFunctionName,
              passedFunction,
              originBurst,
              serverResult
            );

            resolve(originBurst);
          });
        }
      }).catch((error) => {
        throw new Error("something went wrong: " + error);
      });
    }
  }
);

/**
 * Re-runs the specified custom functions.
 *
 * @param {Array} rollCall - An array of custom function names to re-run.
 * @global
 *
 * @description
 * The reRollFunctions function iterates over the provided rollCall and re-runs
 * each specified custom function if it exists on the ë object.
 */
ë.frozenVanilla("reRollFunctions", function (rollCall) {
  function runReRoll(customFunctionName) {
    if (typeof ë[customFunctionName] === "function") {
      ë[customFunctionName]();
    }
  }

  if (Array.isArray(rollCall) && rollCall.length > 1) {
    for (const customFunctionName of rollCall) {
      runReRoll(customFunctionName);
    }
  } else if (rollCall.length === 1) {
    runReRoll(rollCall[0]);
  }
});
