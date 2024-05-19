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
                        return;
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
              return observeDOM(id, vanillaPromise).then((vanillaPromise) => {
                if (config?.components) {
                  vanillaComponents(
                    customFunctionName,
                    renderSchema,
                    vanillaPromise
                  );
                }
                // console.log(
                //   "first vanillaPromise log for " +
                //     customFunctionName +
                //     JSON.stringify(vanillaPromise)
                // );
                return vanillaPromise; // Ensure this promise is returned to the next then
              });
            } else {
              // console.log(
              //   "else first vanillaPromise log for " +
              //     customFunctionName +
              //     JSON.stringify(vanillaPromise)
              // );
              return vanillaPromise; // Ensure this promise is returned to the next then
            }
          })
          .then((vanillaPromise) => {
            // console.log(
            //   "second vanillaPromise log for " +
            //     customFunctionName +
            //     JSON.stringify(vanillaPromise)
            // );
            resolve(vanillaPromise);
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
