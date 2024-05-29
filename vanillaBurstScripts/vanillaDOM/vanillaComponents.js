ë.frozenVanilla(
  "vanillaComponents",
  function (functionFile, renderSchema, vanillaPromise) {
    if (
      !renderSchema &&
      vanillaPromise &&
      typeof vanillaPromise === "object" &&
      vanillaPromise !== null
    ) {
      let renderSchema = vanillaPromise.renderSchema;
    }

    function flattenvanillaElement(components, result = []) {
      for (let component in components) {
        result.push(components[component]);
        if (components[component].components) {
          flattenvanillaElement(components[component].components, result);
        }
      }
      return result;
    }

    function buildCssPath(
      path,
      dir,
      single,
      parent,
      id,
      renderSchema,
      functionFile
    ) {
      if (dir && single && !parent) {
        return `${path}client/components/${dir}css/${id}.css`;
      } else if (dir && !single && !parent) {
        return `${path}client/components/${dir}css/style.css`;
      } else if (parent && single && !dir) {
        return `${path}${renderSchema.customFunctions[functionFile].dir}components/css/${id}.css`;
      } else if ((parent && !single && !dir) || (!parent && !single && !dir)) {
        return `${path}${renderSchema.customFunctions[functionFile].dir}components/css/style.css`;
      }
    }

    function buildHtmlPath(path, dir, parent, id, renderSchema, functionFile) {
      if (!dir && !parent) {
        return `${path}${renderSchema.customFunctions[functionFile].dir}components/${id}.html`;
      } else if (dir && parent) {
        return `${path}${renderSchema.customFunctions[functionFile].dir}components/${dir}${id}.html`;
      } else if (dir && !parent) {
        return `${path}client/components/${dir}${id}.html`;
      } else if (parent && !dir) {
        return `${path}${renderSchema.customFunctions[functionFile].dir}components/${id}.html`;
      }
    }

    function createSanitizedElement(id, sanitizedChildren, className) {
      let parser = new DOMParser();
      let doc = parser.parseFromString(sanitizedChildren, "text/html");

      let elementBuild = document.createElement("div");
      elementBuild.id = id;
      elementBuild.setAttribute("nonce", ë.nonceBack());
      elementBuild.className = className;
      while (doc.body.firstChild) {
        elementBuild.appendChild(doc.body.firstChild);
      }
      return elementBuild;
    }

    try {
      new Promise((resolve, reject) => {
        if (functionFile !== undefined) {
          let componentHTML;
          let components =
            renderSchema?.customFunctions[functionFile]?.components;
          let flattenedvanillaElement = flattenvanillaElement(components);

          if (flattenedvanillaElement) {
            for (let i = 0; i < flattenedvanillaElement.length; i++) {
              let {
                parent = false,
                single = false,
                cssPath,
                id,
                dir,
                namespace,
                className,
                children,
                container,
                cache,
              } = flattenedvanillaElement[i];

              if (cache === false) {
                resolve(vanillaPromise);
              }

              let path = ë.domainUrl + ë.baseUrl;
              cssPath = buildCssPath(
                path,
                dir,
                single,
                parent,
                id,
                renderSchema,
                functionFile
              );
              let htmlPath = buildHtmlPath(
                path,
                dir,
                parent,
                id,
                renderSchema,
                functionFile
              );

              let baseId = id;
              id = `${id}-${renderSchema.landing}_${functionFile}`;
              let viewContainer = document.getElementById(
                renderSchema.customFunctions[functionFile].container
              );
              let targetContainer = viewContainer.querySelector(
                `.${container}`
              );
              let originFunction = renderSchema.landing;
              let renderComponent =
                !namespace || namespace.includes(renderSchema.landing);

              let originBurst =
                JSON.parse(localStorage.getItem("originBurst")) ||
                vanillaPromise.originBurst;
              let cachedComponent = originBurst?.componentBurst?.[id]
                ?.htmlResult
                ? true
                : false;

              if (cachedComponent) {
                children = originBurst.componentBurst[id].htmlResult;
              }

              let sanitizedChildren = ë.sanitizeVanillaDOM(
                children,
                functionFile
              );

              if (viewContainer.contains(targetContainer) && renderComponent) {
                let elementBuild = createSanitizedElement(
                  id,
                  sanitizedChildren,
                  className
                );
                let elements = Array.from(
                  targetContainer.querySelectorAll("*")
                );
                elements.forEach((element) => {
                  if (element.id.includes(element.id.split("-")[0])) {
                    //element.remove();
                    element.setAttribute("nonce", ë.nonceBack());
                  }
                });
                if (
                  !targetContainer.hasChildNodes() ||
                  !targetContainer.querySelector(`#${elementBuild.id}`)
                ) {
                  targetContainer.setAttribute("nonce", ë.nonceBack());
                  targetContainer.append(elementBuild);
                }

                componentHTML = ë.sanitizeVanillaDOM(elementBuild.innerHTML);
                let existingOriginBurst =
                  JSON.parse(localStorage.getItem("originBurst")) || {};
                existingOriginBurst.componentBurst =
                  existingOriginBurst.componentBurst || {};

                let DOMtype = { type: { component: [id, componentHTML] } };

                let updatedOriginBurst = ë.storeComponentBurst(
                  existingOriginBurst,
                  originFunction,
                  functionFile,
                  DOMtype
                );

                originBurst = updatedOriginBurst;
                vanillaPromise.originBurst = originBurst;

                // Store the updated originBurst back to localStorage
                localStorage.setItem(
                  "originBurst",
                  JSON.stringify(originBurst)
                );

                ë.cssFileLoader(cssPath);
              }
            }
            if (componentHTML) {
              resolve(vanillaPromise);
            } else {
              resolve(vanillaPromise);
            }
          }
        }
      })
        .then()
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      ë.logSpacer(console.error(error), null, null, true);
    }
  }
);
