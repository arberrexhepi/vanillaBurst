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

      let fetchUrl = ë.frozenVanilla.get("domainUrl") + customFunctionUrl;
      fetch(fetchUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then((scriptContent) => {
          const scriptId = customFunctionName + "_vanilla";

          // Remove existing script tag if it exists
          const existingScript = document.getElementById(scriptId);
          if (existingScript) {
            existingScript.remove();
          }

          const script = document.createElement("script");
          script.type = "text/javascript";
          let nonceString = ë.nonceBack();

          script.setAttribute("nonce", nonceString);
          script.text = scriptContent;
          script.id = scriptId;
          document.head.appendChild(script);

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
          console.error("Error loading script:", fetchUrl, error);
          reject(new Error(`Error loading script: ${fetchUrl}`));
        });
    });
  }
);
