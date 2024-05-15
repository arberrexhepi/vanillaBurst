window.frozenVanilla(
  "vanillaComponents",
  function (functionFile, renderSchema, originBurst) {
    let componentHTML;
    try {
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

      function waitForElement(id, callback) {
        const interval = setInterval(() => {
          const element = document.getElementById(id);
          console.log("checking");
          if (element) {
            clearInterval(interval);
            callback(element);
          }
        }, 1);
      }

      new Promise((resolve, reject) => {
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

            // Append the HTML content to the container
            id = id + "-" + renderSchema.landing + "_" + functionFile;
            //let viewContainer = document.getElementById("viewbox");
            let viewContainer = document.getElementById(
              renderSchema.customFunctions[functionFile].container
            );
            let targetContainer = viewContainer.querySelector("." + container);

            let renderComponent;

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
              let targetElement = document.getElementById(id);
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
              console.log("here a");

              const elementBuild = createElementBuild(id, sanitizedChildren);
              // Get a reference to the container
              // let targetContainer = document.getElementById(container);

              if (
                !targetContainer.hasChildNodes() ||
                !targetContainer.querySelector(`#${elementBuild.id}`)
              ) {
                targetContainer.setAttribute("nonce", window.nonceBack());

                targetContainer.append(elementBuild);
              }
              let componentHTML = sanitizeVanillaDOM(targetContainer.outerHTML);
              //CACHE IT
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
                componentHTML,
                DOMtype
              );

              window.cssFileLoader(cssPath);
            }
          }
          return componentHTML;
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
