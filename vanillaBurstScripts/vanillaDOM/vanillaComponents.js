window.frozenVanilla(
  "vanillaComponents",
  function (functionFile, renderSchema, originBurst, safeHTML) {
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

        for (let i = 0; i < flattenedvanillaElement.length; i++) {
          let {
            htmlPath: htmlPath,
            parent: parent = false,
            single: single = false,
            cssPath: cssPath,
            id: id,
            dir: dir,
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

          let viewContainer = document.getElementById("viewbox");
          let targetContainer = document.getElementById(container);
          if (viewContainer.contains(targetContainer)) {
            // If the targetElement doesn't exist, create it
            let targetElement = document.getElementById(id);

            if (!targetElement) {
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
              let containerElement = document.getElementById(container);

              waitForElement(container, (containerElement) => {
                // If the containerElement has no child nodes, or if it doesn't contain a child with the same id as elementBuild, append elementBuild
                if (
                  !containerElement.hasChildNodes() ||
                  !containerElement.querySelector(`#${elementBuild.id}`)
                ) {
                  containerElement.append(elementBuild);
                }

                window.cssFileLoader(cssPath);
              });
            } else {
              // If the targetElement does exist, append the children to it
              let sanitizedChildren = window.sanitizeVanillaDOM(children);
              let parser = new DOMParser();
              let doc = parser.parseFromString(sanitizedChildren, "text/html");

              // Create a document fragment
              let fragment = document.createDocumentFragment();

              // Append the children to the fragment
              while (doc.body.firstChild) {
                fragment.appendChild(doc.body.firstChild);
              }

              // Replace the innerHTML of the targetElement with the innerHTML of the fragment
              targetElement.innerHTML = fragment.innerHTML;

              //CACHE IT

              targetElement.append(elementBuild);
              let componentHTML = sanitizeVanillaDOM(targetElement.outerHTML);
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
              console.log("vanilla-element found");
            }
          }
        }
        return safeHTML;
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
