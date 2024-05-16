window.frozenVanilla(
  "singlePromise",
  async function singlePromise(
    renderSchema,
    serverResult,
    passedFunction,
    originBurst
  ) {
    return new Promise((resolve, reject) => {
      if (passedFunction) {
        var customFunction = passedFunction;
        var customFunctionName = customFunction.functionFile;

        if (customFunctionName) {
          executeFunction(customFunctionName, passedFunction);
        }

        async function executeFunction(customFunctionName, passedFunction) {
          // vanillaShortcuts(customFunctionName, passedFunction);

          let vanillaPromise = window.vanillaPromise(
            renderSchema,
            customFunctionName,
            passedFunction,
            serverResult,
            originBurst
          );

          try {
            let prepDOM = await window.domPromises(
              renderSchema,
              customFunctionName,
              vanillaPromise
            );
            let scriptPromises = await window.appendScript(
              renderSchema,

              vanillaPromise,
              passedFunction
            );
            await Promise.all([prepDOM, scriptPromises]);
            window.removeLoader();
            resolve(vanillaPromise);
          } catch (error) {
            reject(error);
          }
        }
      }
    })
      .then()
      .catch();
  }
);
