window.frozenVanilla(
  "domPromises",
  function (renderSchema, customFunctionName, originBurst) {
    return new Promise((resolve, reject) => {
      let config = renderSchema.customFunctions[customFunctionName];
      let safeHTML;

      if (config?.container) {
        loadDOM(
          config,
          customFunctionName,
          renderSchema.landing,
          renderSchema,
          originBurst
        )
          .then((loadedHTML) => {
            if (loadedHTML === null) {
              return Promise.reject(new Error("safeHTML is falsy"));
            }
            safeHTML = loadedHTML;

            let observeDOM = (id) => {
              return new Promise((resolve, reject) => {
                let observerOptions = {
                  childList: true,
                  attributes: true,
                  subtree: true,
                };

                let observerCallback = function (mutationsList, observer) {
                  for (let mutation of mutationsList) {
                    if (
                      mutation.type === "childList" ||
                      mutation.type === "attributes"
                    ) {
                      let domCheck = document.getElementById(id);
                      if (domCheck) {
                        observer.disconnect();
                        resolve();
                      }
                    }
                  }
                };

                let targetNode = document.body;
                let observer = new MutationObserver(observerCallback);
                observer.observe(targetNode, observerOptions);
              });
            };

            let id =
              renderSchema?.customFunctions?.[customFunctionName]?.container;

            if (id) {
              observeDOM(id).then(() => {
                if (config?.components) {
                  vanillaComponents(
                    customFunctionName,
                    renderSchema,
                    originBurst
                  );
                }
              });
            }
          })
          .then((componentHTML) => {
            if (componentHTML === null) {
              return Promise.reject(new Error("safeHTML is falsy"));
            }
            safeHTML = componentHTML;
            resolve(safeHTML);
          })
          .catch((error) => {
            console.error(error);
            reject(error);
          });
      } else {
        resolve(safeHTML);
      }
    });
  }
);
