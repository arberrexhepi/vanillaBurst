function getNonce() {
  let nonceString = window.nonce();
  window.nonceBack(nonceString);
  return nonceString;
}

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

        var baseCustomFunctionDirectory = baseUrl;
        var customFunctionDirectory = customFunction.dir;
        var customFunctionUrl =
          baseCustomFunctionDirectory +
          customFunctionDirectory +
          customFunctionName +
          ".js";

        if (customFunctionName) {
          executeFunction(
            customFunctionName,
            customFunctionUrl,
            passedFunction
          );
        }

        async function executeFunction(
          customFunctionName,
          customFunctionUrl,
          passedFunction
        ) {
          // vanillaShortcuts(customFunctionName, passedFunction);

          let vanillaPromise;

          if (!vanillaPromise || typeof vanillaPromise !== "object") {
            vanillaPromise = {};
            vanillaPromise = {
              schema: window.schema, //TODO check if namespace equals global or not, and pass only the scopes in namespace from config
              renderSchema: renderSchema,
              this: customFunctionName,
              landing: renderSchema.landing,
              passedFunction: passedFunction,
              serverResult: serverResult,
              originBurst: originBurst,
              runFunction: true,
            };
          } else {
            vanillaPromise.serverResult = serverResult;
            vanillaPromise.originBurst = originBurst;
          }

          function domBuild(renderSchema) {
            new Promise(async (resolve, reject) => {
              let config = renderSchema.customFunctions[customFunctionName];
              let safeHTML;

              new Promise((resolve, reject) => {
                if (
                  renderSchema.customFunctions[customFunctionName].container &&
                  renderSchema.customFunctions[customFunctionName].container !==
                    undefined
                ) {
                  safeHTML = loadDOM(
                    config,
                    customFunctionName,
                    renderSchema.landing,
                    renderSchema,
                    originBurst
                  );

                  if (safeHTML !== null) {
                    resolve(safeHTML);
                  } else {
                    reject(new Error("safeHTML is falsy"));
                  }
                } else {
                  resolve("");
                }
              })
                .then((safeHTML) => {
                  new Promise((resolve, reject) => {
                    if (
                      renderSchema.customFunctions[customFunctionName]
                        .components &&
                      renderSchema.customFunctions[customFunctionName]
                        .components !== undefined
                    ) {
                      let parentDOM = document.getElementById(
                        renderSchema.customFunctions[customFunctionName]
                          .container
                      );

                      let domCheck = vanillaElements(
                        customFunctionName,
                        renderSchema,
                        originBurst,
                        safeHTML
                      );

                      if (domCheck !== false) {
                        resolve(domCheck);
                      } else {
                        reject(new Error("safeHTML is falsy"));
                      }
                    } else {
                      resolve(true);
                    }
                  })
                    .then()
                    .catch((error) => {
                      reject(error);
                    });
                })
                .catch((error) => {
                  console.log(error);
                });
              resolve(safeHTML);
            }).catch((error) => {
              console.error(error, "couldn't " + customFunctionName);
            });
          }

          function appendScript(
            customFunctionUrl,
            customFunctionName,
            vanillaPromise,
            passedFunction
          ) {
            return new Promise((resolve, reject) => {
              let fetchUrl = window.domainUrl + customFunctionUrl;

              fetch(fetchUrl)
                .then((response) => {
                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }
                  return response.text();
                })
                .then((scriptContent) => {
                  if (!window[customFunctionName]) {
                    Object.defineProperty(window, customFunctionName, {
                      value: null,
                      writable: true,
                      configurable: false,
                    });
                  }
                  const nonceString = getNonce();
                  const script = document.createElement("script");
                  script.src = fetchUrl;
                  script.type = "text/javascript";
                  script.setAttribute("nonce", nonceString);
                  script.text = scriptContent;
                  script.id = customFunctionName;
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
                  console.log(JSON.stringify(vanillaPromise));
                  resolve(vanillaPromise);
                })
                .catch((error) => {
                  console.error("Error loading script:", fetchUrl, error);
                  reject(new Error(`Error loading script: ${fetchUrl}`));
                });
            });
          }

          try {
            let domPromises = domBuild(renderSchema);
            let scriptPromises = appendScript(
              customFunctionUrl,
              customFunctionName,
              vanillaPromise,
              passedFunction
            );
            await Promise.all([domPromises, scriptPromises]);
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
