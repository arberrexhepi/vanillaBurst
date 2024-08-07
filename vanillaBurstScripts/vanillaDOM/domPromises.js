ë.frozenVanilla(
  "domPromises",
  function (renderSchema, customFunctionName, vanillaPromise) {
    return new Promise(async (resolve, reject) => {
      let config = renderSchema.customFunctions[customFunctionName];
      let safeHTML;

      if (config?.container) {
        return new Promise((resolve, reject) => {
          vanillaPromise = loadDOM(
            config,
            customFunctionName,
            renderSchema.landing,
            renderSchema,
            vanillaPromise
          );
          resolve(vanillaPromise);
        })
          .then((vanillaPromise) => {
            let observeDOM = async (id, vanillaPromise) => {
              let observerOptions = {
                childList: true,
                attributes: true,
                subtree: true,
              };

              return new Promise((resolve, reject) => {
                let observerCallback = function (mutationsList, observer) {
                  for (let mutation of mutationsList) {
                    console.log("Mutation type:", mutation.type);
                    console.log(
                      "Mutation target innerHTML:",
                      mutation.target.innerHTML
                    );

                    if (
                      mutation.type === "childList" ||
                      mutation.type === "attributes" ||
                      (mutation.type === "childList" &&
                        mutation.target.innerHTML === "")
                    ) {
                      let domCheck;

                      domCheck = document.getElementById(id);

                      console.log("domCheck:", domCheck);

                      if (domCheck) {
                        observer.disconnect();

                        return vanillaPromise;
                      }
                    }
                  }
                };

                let targetNode = document.body;
                let observer = new MutationObserver(observerCallback);
                let vanillaPromise = observer.observe(
                  targetNode,
                  observerOptions
                );
                resolve(vanillaPromise);
              }).catch((error) => {
                console.error(error);
              });
            };

            let id =
              renderSchema?.customFunctions?.[customFunctionName]?.container;

            if (id) {
              return observeDOM(
                id,
                vanillaPromise,
                customFunctionName,
                renderSchema
              )
                .then((vanillaPromise) => {
                  try {
                    if (config?.components) {
                      vanillaComponents(
                        customFunctionName,
                        renderSchema,
                        vanillaPromise
                      );
                    }
                  } catch (error) {
                    alert(error);
                  }
                  // console.log(
                  //   "first vanillaPromise log for " +
                  //     customFunctionName +
                  //     JSON.stringify(vanillaPromise)
                  // );
                  return vanillaPromise; // Ensure this promise is returned to the next then
                })
                .catch((error) => {
                  reject(error);
                });
            } else {
              return vanillaPromise; // Ensure this promise is returned to the next then
            }
          })
          .catch((error) => {
            reject(error);
          })
          .then((vanillaPromise) => {
            // console.log(
            //   "second vanillaPromise log for " +
            //     customFunctionName +
            //     JSON.stringify(vanillaPromise)
            // );
            ë.vanillaImages(true);

            resolve(vanillaPromise);
          })
          .catch((error) => {
            ë.logSpacer(console.error(error), null, null, true);
            reject(error);
          });
      } else {
        ë.vanillaImages(true);

        resolve(vanillaPromise);
      }
    });
  }
);
