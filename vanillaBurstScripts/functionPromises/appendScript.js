function getNonce() {
  let nonceString = window.nonce();
  window.nonceBack(nonceString);
  return nonceString;
}

window.frozenVanilla(
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
      let fetchUrl = window.domainUrl + customFunctionUrl;
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
          let nonceString = window.nonceBack();

          // console.log("nonceString:", nonceString); // Log the nonce
          // // Get the CSP from the meta tag
          // const csp = document.querySelector(
          //   'meta[http-equiv="Content-Security-Policy"]'
          // ).content;
          // Extract the nonce from the CSP
          //const metaNonce = csp.match(/'nonce-(.*?)'/)[1];
          // console.log("meta nonce:", metaNonce); // Log the meta nonce
          script.setAttribute("nonce", nonceString);
          script.text = scriptContent;
          script.id = scriptId;
          document.head.appendChild(script);

          //console.log("script nonce:", script.getAttribute("nonce")); // Log the script's nonce

          // Get the CSP from the meta tag
          // const cspAfter = document.querySelector(
          //   'meta[http-equiv="Content-Security-Policy"]'
          // ).content;
          // // Extract the nonce from the CSP
          // const metaNonceAfter = cspAfter.match(/'nonce-(.*?)'/)[1];
          // console.log("meta nonce:", metaNonceAfter); // Log the meta nonce

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
