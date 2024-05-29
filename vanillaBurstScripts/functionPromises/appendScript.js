function getNonce() {
  let nonceString = ë.nonce();
  ë.nonceBack(nonceString);
  return nonceString;
}

ë.frozenVanilla(
  "appendScript",
  function (renderSchema, vanillaPromise, passedFunction) {
    return new Promise((resolve, reject) => {
      let customFunction = passedFunction;
      let customFunctionName = customFunction.functionFile;

      let baseCustomFunctionDirectory = baseUrl;
      let customFunctionDirectory = customFunction.dir;
      let customFunctionUrl =
        baseCustomFunctionDirectory +
        customFunctionDirectory +
        customFunctionName +
        ".js";

      ë.loadScript(customFunctionUrl)
        .then(() => {
          if (
            passedFunction.dataSchema &&
            passedFunction.dataSchema.auto !== false
          ) {
            let cached = true;
            if (passedFunction.cached && passedFunction === true) {
              cached = false;
            }
          }
          let domHtmlResult =
            JSON.parse(localStorage.getItem("originBurst"))?.[
              renderSchema.landing
            ]?.[customFunctionName]?.htmlResult || undefined;

          if (domHtmlResult !== undefined) {
            vanillaPromise.originBurst[renderSchema.landing] =
              vanillaPromise.originBurst[renderSchema.landing] || {};
            vanillaPromise.originBurst[renderSchema.landing][
              customFunctionName
            ] =
              vanillaPromise.originBurst[renderSchema.landing][
                customFunctionName
              ] || {};

            // Update htmlResult regardless of whether it already exists

            vanillaPromise.originBurst[renderSchema.landing][
              customFunctionName
            ].htmlResult = domHtmlResult;
          }
          // console.log(JSON.stringify(vanillaPromise));
          resolve(vanillaPromise);
        })
        .catch((error) => {
          ë.logSpacer(
            console.error("Error loading script:", fetchUrl, error),
            null,
            null,
            true
          );
          reject(new Error(`Error loading script: ${fetchUrl}`));
        });
    });
  }
);
