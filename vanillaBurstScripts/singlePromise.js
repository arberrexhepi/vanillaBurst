ë.frozenVanilla(
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

          let vanillaPromise = ë.vanillaPromise(
            renderSchema,
            customFunctionName,
            passedFunction,
            serverResult,
            originBurst
          );

          try {
            let prepDOM = await ë.domPromises(
              renderSchema,
              customFunctionName,
              vanillaPromise
            );
            let scriptPromises = await ë.appendScript(
              renderSchema,

              vanillaPromise,
              passedFunction
            );
            await Promise.all([prepDOM, scriptPromises]);
            ë.removeLoader();
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
