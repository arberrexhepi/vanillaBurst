//TODO:  CSS paths not correct for parent:true or null, dir: true or null

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

    function flattenVanillaElement(components, result = []) {
      for (let component in components) {
        let componentArray = [component, components];
        result.push(componentArray);
        if (components[component].components) {
          flattenVanillaElement(components[component].components, result);
        }
      }
      return result;
    }
    function buildCssPath(path, dir, id, renderSchema, functionFile) {
      if (dir && dir !== "") {
        return `${path}client/components/${dir}/${dir.split("/")[0]}.css`;
      } else {
        return `${path}client/components/${functionFile}/${functionFile}.css`;
      }
    }

    function buildHtmlPath(path, dir, id, renderSchema, functionFile) {
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

    function createSanitizedElement(id, sanitizedChildren, classNames) {
      let parser = new DOMParser();
      let doc = parser.parseFromString(sanitizedChildren, "text/html");

      let elementBuild = document.createElement("div");
      elementBuild.id = id;
      elementBuild.setAttribute("nonce", ë.nonceBack());
      if (classNames) {
        let classNameList = classNames.trim().replace(/\s+/g, " ").split(" ");
        for (let className of classNameList) {
          elementBuild.classList.add(className);
        }
      }
      while (doc.body.firstChild) {
        elementBuild.appendChild(doc.body.firstChild);
      }
      return elementBuild;
    }

    try {
      new Promise(async (resolve, reject) => {
        //alert(JSON.stringify(vanillaPromise));
        if (!vanillaPromise?.componentList) {
          vanillaPromise["componentList"] = [];
        }
        if (functionFile !== undefined) {
          let componentHTML;
          let components =
            renderSchema?.customFunctions[functionFile]?.components;
          let flattenedvanillaElement = flattenVanillaElement(components);
          if (flattenedvanillaElement) {
            for (let key in flattenedvanillaElement) {
              let id = flattenedvanillaElement[key][0];

              let {
                dir = undefined,
                path = null,
                componentName = id,
                namespace = null,
                classNames = id,
                parent = false,
                children = "",
                container = `${renderSchema.customFunctions[functionFile].container}Container`,
                count = 1,
                cache,
              } = flattenedvanillaElement[key][1][id];

              if (cache === false) {
                resolve(vanillaPromise);
              }

              //let path = ë.domainUrl + ë.baseUrl;
              let cssPath = path + componentName + ".css";
              let jsPath = path + componentName + ".js";
              let baseId = id;
              id = `${baseId}-${renderSchema.landing}_${functionFile}`;

              let viewContainerSelector = `.${renderSchema.customFunctions[functionFile].container}-wrapper`;
              let targetContainerSelector = `.${container}`;
              console.log("view container tag: " + viewContainerSelector);
              let viewContainer = document.querySelector(viewContainerSelector);

              let targetContainer = document.querySelector(
                targetContainerSelector
              );
              console.log(
                "View container html :" + JSON.stringify(viewContainer)
              );
              console.log("compontent selector: " + targetContainerSelector);

              let originFunction = renderSchema.landing;

              if (!namespace) {
                namespace = renderSchema.landing;
              }

              let isNameSpaced = namespace.includes(renderSchema.landing); ///TODO

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
              if (isNameSpaced) {
                let sanitizedChildren = await ë.sanitizeVanillaDOM(
                  children,
                  functionFile
                );
                let elements;
                try {
                  elements = Array.from(targetContainer.querySelectorAll("*"));
                } catch {
                  throw new Error("targetContainer: " + targetContainer);
                }
                elements.forEach((element) => {
                  if (element.id.includes(element.id.split("-")[0])) {
                    //element.remove();
                    element.setAttribute("nonce", ë.nonceBack());
                  }
                });

                for (let i = 0; i < count; i++) {
                  let elementId = count > 1 ? `${id}${i}` : id;

                  let elementBuild = createSanitizedElement(
                    elementId,
                    sanitizedChildren,
                    classNames
                  );

                  if (
                    !targetContainer.hasChildNodes() ||
                    !targetContainer.querySelector(`#${container}-component`)
                  ) {
                    targetContainer.setAttribute("nonce", ë.nonceBack());
                    targetContainer.append(elementBuild);
                  }
                  componentHTML = await ë.sanitizeVanillaDOM(
                    elementBuild.innerHTML
                  );

                  ë.cssFileLoader(cssPath);

                  let existingOriginBurst =
                    JSON.parse(localStorage.getItem("originBurst")) || {};
                  existingOriginBurst.componentBurst =
                    existingOriginBurst.componentBurst || {};

                  let DOMtype = {
                    type: { component: [elementId, componentHTML] },
                  };

                  let updatedOriginBurst = await ë.storeComponentBurst(
                    existingOriginBurst,
                    originFunction,
                    functionFile,
                    DOMtype
                  );

                  originBurst = updatedOriginBurst;
                  if (vanillaPromise?.originBurst) {
                    vanillaPromise.originBurst = originBurst;
                  }

                  // Store the updated originBurst back to localStorage
                  localStorage.setItem(
                    "originBurst",
                    JSON.stringify(originBurst)
                  );
                  if (!parent && parent !== true) {
                    vanillaPromise.componentList.push(componentName);
                  }
                }
              }
            }
            if (componentHTML) {
              // alert(vanillaPromise.componentList);
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
