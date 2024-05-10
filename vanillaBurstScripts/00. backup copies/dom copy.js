///You should try frozenVanilla! it's awesome

// Centralized nonce management
function getNonce() {
  let nonceString = window.nonce();
  window.nonceBack(nonceString);
  return nonceString;
}

window.frozenVanilla(
  "htmlFIleLoader",
  async function ({ htmlPath, cssPath }, DOMFileLOADcallback) {
    try {
      const getContent = async (path) => {
        const response = await fetch(path);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const content = await response.text();
        return content;
      };

      // Get HTML content
      const nonceString = getNonce();

      const htmlText = await getContent(htmlPath);
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, "text/html");

      // Apply nonce to script and style elements
      let scriptElements = doc.getElementsByTagName("script");
      for (let i = 0; i < scriptElements.length; i++) {
        scriptElements[i].nonce = nonceString;
      }

      let styleElements = doc.getElementsByTagName("style");
      for (let i = 0; i < styleElements.length; i++) {
        styleElements[i].nonce = nonceString;
      }

      const contentToUse = doc.body.innerHTML;
      if (htmlPath) {
        if (typeof DOMFileLOADcallback === "function") {
          DOMFileLOADcallback(contentToUse);
        }
      }

      // Apply nonce to meta and script tags in the main document
      window.nonceBack(nonceString);

      // Apply CSS content using <link> tag
      window.singleCSS(cssPath);
    } catch (error) {
      console.error("Error:", error);
    }
  }
);

window.frozenVanilla("singleCSS", function (cssPath) {
  if (cssPath) {
    let linkTag = document.head.querySelector(
      `link[data-css-path="${cssPath}"]`
    );
    if (!linkTag) {
      const nonceString = getNonce();

      linkTag = document.createElement("link");
      linkTag.setAttribute("rel", "stylesheet");
      linkTag.setAttribute("href", cssPath);
      linkTag.setAttribute("data-css-path", cssPath);
      linkTag.setAttribute("nonce", nonceString);
      document.head.appendChild(linkTag);
    }
  }
});

window.frozenVanilla(
  "checkAndSanitizeHTML",
  function (htmlString, functionFile) {
    const config = {
      ADD_TAGS: ["vanilla-element"], // add your custom tags here
      USE_PROFILES: { html: true },
    };

    const cleanHTML = DOMPurify.sanitize(htmlString, config);

    return cleanHTML;
  }
);

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
      const safeHTML = await window.miniDOM(
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
  "miniDOM",
  function (
    domConfig,
    domFunction,
    originFunction,
    initView,
    renderSchema,
    originBurst
  ) {
    let thisConfig = domConfig;

    ////SANTIZE HTML

    ////SIGNAL BURST UPDATES
    function updateTargetElementContent(originFunction, functionFile) {
      // Get signalResult and container from signalBurst
      let signalBurst = JSON.parse(localStorage.getItem("signalBurst")) || {};
      let signalResult =
        signalBurst?.[originFunction]?.[functionFile]?.signalResult;
      if (signalResult) {
        signalResult = DOMPurify.sanitize(signalResult);
      }

      let container = signalBurst?.[originFunction]?.[functionFile]?.container;
      // Check if signalResult and container are set
      if (
        signalResult !== undefined &&
        signalResult !== null &&
        container !== undefined
      ) {
        // Get the target element by ID
        let targetElement = document.getElementById(container);

        // If the target element exists, update its content with signalResult
        if (targetElement) {
          targetElement.innerHTML = signalResult;
        }

        return true;
      } else {
        return false;
      }
    }

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

    // Check for cached content
    return new Promise(async (resolve, reject) => {
      // Check for cached content
      // Sanitize the HTML content
      let safeHTML;
      if (functionFile && functionFile !== undefined) {
        safeHTML = window.checkAndSanitizeHTML(
          originBurst[originFunction][functionFile].htmlResult,
          functionFile
        );
      }

      // Get the target element or create it if it doesn't exist
      let targetElement = document.getElementById(container);

      // if (functionFile && functionFile !== undefined) {
      //   targetElement.innterHTML = safeHTML;
      // }
      await continueDOM(htmlPath, cssPath, container)
        .then((safeHTML) => {
          resolve(safeHTML); // Resolve the Promise with 'domReady'
        })
        .catch((error) => {
          reject(error); // Reject the Promise with an error
        });

      // Assign sanitized HTML to innerHTML
    });

    // Function to continue DOM processing
    function continueDOM(htmlPath, cssPath, container, originBurst) {
      ("defined");
      return new Promise((resolve, reject) => {
        let originBurst = JSON.parse(localStorage.getItem("originBurst")) || {};
        let htmlResult =
          originBurst?.[originFunction]?.[functionFile]?.htmlResult;

        if (htmlResult) {
          let targetElement =
            document.getElementById(container) ||
            document.querySelector(`div#${container}`);

          if (!targetElement) {
            targetElement = document.createElement("div");
            let nonceString = window.nonce();
            window.nonceBack(nonceString);
            targetElement.setAttribute("nonce", nonceString);
            document.body.appendChild(targetElement);
          }

          targetElement.innerHTML = htmlResult;

          let signalDOMUpdate = updateTargetElementContent(
            originFunction,
            functionFile
          );
          // Cache the result
          if (signalDOMUpdate === true) {
            if (functionFile && functionFile !== undefined) {
              safeHTML = window.checkAndSanitizeHTML(
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

          window.singleCSS(cssPath);
        } else {
          window.htmlFIleLoader({ htmlPath, cssPath }, (htmlContent) => {
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
              safeHTML = window.checkAndSanitizeHTML(htmlContent, functionFile);
            }

            if (safeHTML) {
              targetElement.innerHTML = safeHTML;
            }
            let signalDOMUpdate = updateTargetElementContent(
              originFunction,
              functionFile
            );
            // Cache the result
            window.storeBurstOrigin(
              originBurst,
              originFunction,
              functionFile,
              safeHTML
            );
            if (functionFile && functionFile !== undefined) {
              if (signalDOMUpdate === true) {
                safeHTML = window.checkAndSanitizeHTML(
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

window.frozenVanilla(
  "vanillaElements",
  function (functionFile, renderSchema, originBurst, safeHTML) {
    let components = renderSchema?.customFunctions[functionFile]?.components;
    function flattenvanillaElement(components, result = []) {
      for (let component in components) {
        result.push(components[component]);

        if (components[component].components) {
          flattenvanillaElement(components[component].components, result);
        }
      }

      return result;
    }
    try {
      new Promise((resolve, reject) => {
        let flattenedvanillaElement = flattenvanillaElement(components);

        for (let i = 0; i < flattenedvanillaElement.length; i++) {
          let {
            htmlPath: htmlPath,
            parent: parent = false,
            single: single = false,
            cssPath: cssPath,
            id: id,
            dir: dir,
            className: className,
            elementAttr: elementAttr,
            container: container = id,
          } = flattenedvanillaElement[i];

          let htmlContent;

          console.debug(flattenedvanillaElement[i]);

          let path = window.domainUrl + window.baseUrl;
          ////independent component relative paths
          if (dir && dir && single === true && !parent) {
            cssPath = path + "client/components/" + dir + "css/" + id + ".css";
          } else if (dir && dir && !single && !parent) {
            cssPath = path + "client/components/" + dir + "css/style.css";
          }
          ////
          //view relative component paths

          if (parent && parent === true && single === true && !dir) {
            cssPath =
              path +
              renderSchema.customFunctions[functionFile].dir +
              "components/css/" +
              id +
              ".css";
          } else if (
            (parent && parent === true && single !== true && !dir) ||
            (parent && parent !== true && single !== true && !dir)
          ) {
            cssPath =
              path +
              renderSchema.customFunctions[functionFile].dir +
              "components/css/style.css";
          }
          console.log("css path for " + id + " " + cssPath);

          if (!dir && !parent) {
            htmlPath =
              path +
              renderSchema.customFunctions[functionFile].dir +
              "components/" +
              id +
              ".html";
          } else if (dir && parent) {
            htmlPath =
              path +
              renderSchema.customFunctions[functionFile].dir +
              "components/" +
              dir +
              id +
              ".html";
          } else if (dir && !parent) {
            htmlPath = path + "client/components/" + dir + id + ".html";
          } else if (parent && !dir) {
            htmlPath =
              path +
              renderSchema.customFunctions[functionFile].dir +
              "components/" +
              id +
              ".html";
          }

          console.log(htmlPath + " html path for " + id);

          /////////

          window.htmlFIleLoader({ htmlPath, cssPath }, (htmlContent) => {
            // Append the HTML content to the container

            let getTarget = id;
            let targetElement = document.querySelector(
              `vanilla-element[name="${id}"]`
            );
            let viewContainer = document.getElementById(
              renderSchema.customFunctions[renderSchema.landing].container
            );
            let safeHTML;
            if (functionFile && functionFile !== undefined) {
              safeHTML = window.checkAndSanitizeHTML(htmlContent, functionFile);
            }

            if (viewContainer) {
              // If the targetElement doesn't exist, create it
              if (!targetElement) {
                defineVanillaElement();

                let targetElement = document.createElement("vanilla-element");
                targetElement.setAttribute("name", id);
                let nonceString = window.nonce();
                window.nonceBack(nonceString);
                targetElement.setAttribute("nonce", nonceString);

                let elementBuild = createElementBuild(
                  id,
                  elementAttr,
                  safeHTML
                );

                window.singleCSS(cssPath);

                function createElementBuild(id, elementAttr, safeHTML) {
                  let elementBuild = document.createElement("div");
                  elementBuild.id = id;
                  let nonceString = window.nonce();
                  window.nonceBack(nonceString);
                  elementBuild.setAttribute("nonce", nonceString);
                  for (let [key, value] of Object.entries(elementAttr)) {
                    elementBuild.setAttribute(key, value);
                  }

                  let parser = new DOMParser();
                  let doc = parser.parseFromString(safeHTML, "text/html");

                  while (doc.body.firstChild) {
                    elementBuild.appendChild(doc.body.firstChild);
                  }

                  return elementBuild;
                }
                console.log(targetElement);
                elementBuild = createElementBuild(id, elementAttr, safeHTML);
                targetElement.append(elementBuild);

                let componentHTML = checkAndSanitizeHTML(
                  targetElement.outerHTML
                );
                let DOMtype = {
                  type: {
                    component: [id, componentHTML],
                  },
                };
                let originFunction = functionFile;
                window.storeBurstOrigin(
                  originBurst,
                  originFunction,
                  functionFile,
                  safeHTML,
                  DOMtype
                );
                console.log("vanilla-element found");
                return true;
              }
            }
          });
        }
      })
        .then((resolve) => {
          resolve(true);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }

    return true;
  }
);
