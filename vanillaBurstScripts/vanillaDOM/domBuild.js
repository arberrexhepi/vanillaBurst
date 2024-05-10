///You should try frozenVanilla! it's awesome

// Centralized nonce management
function getNonce() {
  let nonceString = window.nonce();
  window.nonceBack(nonceString);
  return nonceString;
}

////for this consider making window.schema available to helper functions as a localstorage object instead, so a dev doesn't have to keep passing all this info, or change this (which i don't want to because too much reconfiguring in singlePromise.js for now)
window.frozenVanilla(
  "loadDOM",
  async function (
    config,
    domFunction,
    originFunction,
    renderSchema,
    originBurst,
    initView
  ) {
    return new Promise(async (resolve, reject) => {
      const safeHTML = await window.loadParts(
        config,
        domFunction,
        originFunction,
        initView,
        renderSchema,
        originBurst
      );

      if (safeHTML !== null) {
        resolve(safeHTML);
      } else {
        reject(new Error("safeHTML is falsy"));
      }
    })
      .then()
      .catch((error) => {
        console.error(error);
      });
  }
);

window.frozenVanilla(
  "loadParts",
  function (
    domConfig,
    domFunction,
    originFunction,
    initView,
    renderSchema,
    originBurst
  ) {
    let functionFile, htmlPath, cssPath, container, passedFunction;

    // Determine the function to use
    passedFunction =
      renderSchema.customFunctions?.[domFunction] ?? domConfig[domFunction];

    if (passedFunction.functionFile) {
      functionFile = passedFunction.functionFile;
      htmlPath = window.baseUrl + passedFunction.htmlPath;
      if (passedFunction.cssPath) {
        cssPath = window.baseUrl + passedFunction.cssPath;
      } else {
        cssPath = null;
      }

      container = passedFunction.container;
    } else {
      console.error("Function file not found");
      return;
    }

    let targetElement = document.getElementById(container);
    continueDOM(htmlPath, cssPath, container);

    // Function to continue DOM processing
    function continueDOM(htmlPath, cssPath, container, originBurst) {
      return new Promise((resolve, reject) => {
        let originBurst;

        try {
          originBurst = JSON.parse(localStorage.getItem("originBurst"));
        } catch (error) {
          console.error("Error parsing originBurst from localStorage:", error);
          originBurst = {};
        }
        let htmlResult =
          originBurst?.[originFunction]?.[functionFile]?.htmlResult;

        if (htmlResult) {
          let targetElement =
            document.getElementById(container) ||
            document.querySelector(`div#${container}`);

          if (!targetElement) {
            targetElement = document.createElement("div");
            let nonceString = window.nonce();
            console.log("nonceString:", nonceString); // Check nonceString
            window.nonceBack(nonceString);
            targetElement.setAttribute("nonce", nonceString);
            console.log("document.body:", document.body); // Check document.body
            document.body.appendChild(targetElement);
          }

          console.log("htmlResult:", htmlResult); // Check htmlResult
          targetElement.innerHTML = htmlResult;

          let signalDOMUpdate = signalBurstDOM(originFunction, functionFile);
          // Cache the result
          if (signalDOMUpdate === true) {
            if (functionFile && functionFile !== undefined) {
              safeHTML = window.sanitizeVanillaDOM(
                targetElement.innerHTML,
                functionFile
              );
              window.storeBurstOrigin(
                originBurst,
                originFunction,
                functionFile,
                safeHTML
              );
            }
          }

          window.cssFileLoader(cssPath);
        } else {
          window.htmlFileLoader({ htmlPath, cssPath }, (htmlContent) => {
            // Sanitize the HTML content
            let targetElement =
              document.getElementById(container) ||
              document.querySelector(`div#${container}`);
            let safeHTML;

            if (!targetElement) {
              targetElement = document.createElement("div");
              targetElement.id = container;
              let nonceString = window.nonce();
              window.nonceBack(nonceString);
              targetElement.setAttribute("nonce", nonceString);
              document.body.appendChild(targetElement);
            }

            if (functionFile) {
              safeHTML = window.sanitizeVanillaDOM(htmlContent, functionFile);
            }

            if (safeHTML) {
              targetElement.innerHTML = safeHTML;
            }

            window.cssFileLoader(cssPath);
            let signalDOMUpdate = signalBurstDOM(originFunction, functionFile);
            // Cache the result
            window.storeBurstOrigin(
              originBurst,
              originFunction,
              functionFile,
              safeHTML
            );
            if (functionFile && functionFile !== undefined) {
              if (signalDOMUpdate === true) {
                safeHTML = window.sanitizeVanillaDOM(
                  targetElement.innerHTML,
                  functionFile
                );
                window.storeBurstOrigin(
                  originBurst,
                  originFunction,
                  functionFile,
                  safeHTML
                );

                resolve(safeHTML);
              } else {
                resolve(safeHTML);
              }
            }
            // Resolve the Promise
          });
        }
      });
    }
  }
);
