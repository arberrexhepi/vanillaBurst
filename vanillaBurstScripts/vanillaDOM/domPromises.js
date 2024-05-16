window.frozenVanilla(
  "domPromises",
  function (renderSchema, customFunctionName, vanillaPromise) {
    return new Promise((resolve, reject) => {
      let config = renderSchema.customFunctions[customFunctionName];
      let safeHTML;

      if (config?.container) {
        loadDOM(
          config,
          customFunctionName,
          renderSchema.landing,
          renderSchema,
          vanillaPromise
        )
          .then((vanillaPromise) => {
            // console.log(
            //   "here at the end of loadDOM at the then " +
            //     JSON.stringify(vanillaPromise)
            // );
            let observeDOM = (id, vanillaPromise) => {
              let observerOptions = {
                childList: true,
                attributes: true,
                subtree: true,
              };

              return new Promise((resolve, reject) => {
                let observerCallback = function (mutationsList, observer) {
                  for (let mutation of mutationsList) {
                    if (
                      mutation.type === "childList" ||
                      mutation.type === "attributes"
                    ) {
                      let domCheck = document.getElementById(id);
                      if (domCheck) {
                        observer.disconnect();
                        resolve(vanillaPromise);
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
              observeDOM(id, vanillaPromise).then((vanillaPromise) => {
                if (config?.components) {
                  vanillaComponents(
                    customFunctionName,
                    renderSchema,
                    vanillaPromise
                  );
                }
              });
            }
          })
          .then((vanillaPromise) => {
            resolve(vanillaPromise);
            //console.log("here at the end of it " + vanillaPromise);
          })
          .catch((error) => {
            console.error(error);
            reject(error);
          });
      } else {
        resolve(vanillaPromise);
      }
    });
  }
);
