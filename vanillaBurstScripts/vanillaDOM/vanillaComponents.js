window.frozenVanilla(
  "vanillaComponents",
  function (functionFile, renderSchema, vanillaPromise) {
    try {
      new Promise((resolve, reject) => {
        if (functionFile !== undefined) {
          let componentHTML;

          let components =
            renderSchema?.customFunctions[functionFile]?.components;
          function flattenvanillaElement(components, result = []) {
            for (let component in components) {
              result.push(components[component]);

              if (components[component].components) {
                flattenvanillaElement(components[component].components, result);
              }
            }

            return result;
          }
          let flattenedvanillaElement = flattenvanillaElement(components);

          if (flattenedvanillaElement) {
            for (let i = 0; i < flattenedvanillaElement.length; i++) {
              let {
                htmlPath: htmlPath,
                parent: parent = false,
                single: single = false,
                cssPath: cssPath,
                id: id,
                dir: dir,
                namespace: namespace,
                className: className,
                children: children,
                container: container,
              } = flattenedvanillaElement[i];

              let htmlContent;

              console.debug(flattenedvanillaElement[i]);
              if (flattenedvanillaElement[i].children) {
                console.debug(flattenedvanillaElement[i].children);
              }

              let path = window.domainUrl + window.baseUrl;
              ////independent component relative paths
              if (dir && dir && single === true && !parent) {
                cssPath =
                  path + "client/components/" + dir + "css/" + id + ".css";
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
              //  console.log("css path for " + id + " " + cssPath);

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

              // console.log(htmlPath + " html path for " + id);

              /////////
              baseId = id;
              // Append the HTML content to the container
              id = id + "-" + renderSchema.landing + "_" + functionFile;
              //let viewContainer = document.getElementById("viewbox");
              let viewContainer = document.getElementById(
                renderSchema.customFunctions[functionFile].container
              );
              let targetContainer = viewContainer.querySelector(
                "." + container
              );
              let originFunction = renderSchema.landing;

              let renderComponent;
              let originBurst =
                JSON.parse(localStorage.getItem("originBurst")) ||
                vanillaPromise.originBurst;
              //console.log("this is origin burst" + originBurst);
              let cachedComponent;
              if (!namespace) {
                renderComponent = true;
              } else {
                if (namespace.includes(renderSchema.landing)) {
                  renderComponent = true;
                }
              }

              if (
                viewContainer.contains(targetContainer) &&
                renderComponent === true
              ) {
                // If the targetElement doesn't exist, create it

                //let children;
                if (originBurst?.componentBurst?.[baseId]) {
                  let component = originBurst.componentBurst[baseId];
                  if (component && component.htmlResult) {
                    children = component.htmlResult;
                    cachedComponent = true;
                  }
                } else {
                  cachedComponent = false;
                }

                let sanitizedChildren = window.sanitizeVanillaDOM(children);

                function createElementBuild(id, sanitizedChildren) {
                  let parser = new DOMParser();
                  let doc = parser.parseFromString(
                    sanitizedChildren,
                    "text/html"
                  );
                  const nonceString2 = window.nonceBack();
                  let elementBuild = document.createElement("div");
                  elementBuild.id = id;
                  elementBuild.class = className;
                  elementBuild.setAttribute("nonce", nonceString2);

                  while (doc.body.firstChild) {
                    elementBuild.appendChild(doc.body.firstChild);
                  }
                  return elementBuild;
                }
                let elementBuild;
                elementBuild = createElementBuild(id, sanitizedChildren);

                if (
                  !targetContainer.hasChildNodes() ||
                  !targetContainer.querySelector(`#${elementBuild.id}`)
                ) {
                  targetContainer.setAttribute("nonce", window.nonceBack());

                  targetContainer.append(elementBuild);
                }
                componentHTML = sanitizeVanillaDOM(elementBuild.innerHTML);
                //CACHE IT

                let DOMtype = {
                  type: {
                    component: [baseId, componentHTML],
                  },
                };
                let updatedOriginBurst = window.storeComponentBurst(
                  originBurst,
                  originFunction,
                  functionFile,
                  DOMtype
                );
                //console.log(JSON.stringify(updatedOriginBurst));
                originBurst = updatedOriginBurst;
                vanillaPromise.originBurst = originBurst;

                window.cssFileLoader(cssPath);
              }
            }
            if (componentHTML !== null) {
              resolve(vanillaPromise);
            } else {
              reject(new Error("functionHTML is falsy"));
            }
          }
        }
      })
        .then()
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      console.error(error);
    }
  }
);
