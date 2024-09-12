// Centralized nonce management

ë.frozenVanilla(
  "loadDOM",
  async function (
    config,
    domFunction,
    originFunction,
    renderSchema,
    vanillaPromise,
    initView
  ) {
    //alert("yo");
    // alert("at loadDOM " + domFunction);
    return new Promise(async (resolve, reject) => {
      if (renderSchema?.customFunctions?.[domFunction]?.cache === false) {
        ë.logSpacer(
          console.error(vanillaPromise + " vanillapromise at dom build"),
          null,
          null,
          true
        );
        return true;
      } else {
        try {
          await ë.loadParts(
            config,
            domFunction,
            originFunction,
            initView,
            renderSchema,
            vanillaPromise,
            resolve
          );
          //alert("at loadDOM beforer resulve " + JSON.stringify(vanillaPromise));

          resolve(vanillaPromise);
        } catch (error) {
          ë.logSpacer(
            console.warn(
              "[domBuild.js] ë.loadDOM:If you were expecting DOM here, vanillaPromise was resolved by default and rendering will continue. This currently processes all renderSchema.customFunctions keys. Please make sure you were not expecting DOM rendered from " +
                domFunction,
              null,
              null,
              true
            )
          );

          resolve(vanillaPromise);
        }
      }
    });
  }
);

ë.frozenVanilla(
  "loadParts",
  async function (
    domConfig,
    domFunction,
    originFunction,
    initView,
    renderSchema,
    vanillaPromise,
    resolve
  ) {
    // Determine the function to use
    const passedFunction =
      renderSchema.customFunctions?.[domFunction] ?? domConfig[domFunction];
    //alert(JSON.stringify(passedFunction));
    if (!passedFunction?.functionFile) {
      // TODO: Consider adding a check for passedFunction.functionFile.container here once the rendering techniques are finalized

      return resolve(vanillaPromise);
    }

    const functionFile = passedFunction.functionFile;
    let htmlPath;
    if (passedFunction?.htmlPath) {
      htmlPath = ë.baseUrl + passedFunction?.htmlPath;
    }
    const cssPath = passedFunction.cssPath
      ? ë.baseUrl + passedFunction.cssPath
      : null;
    const container = passedFunction.container;

    let originBurst = vanillaPromise.originBurst;

    const targetElementPromise = new Promise((resolve, reject) => {
      const classNames = passedFunction?.classNames || null;
      let element = ë.createNewElement(container, classNames, passedFunction);

      ///within this function we could check for cache:true, false, dynamic or whatever else to resolve in this promise to be passed to htmlFileLoader()

      element
        ? resolve(element)
        : reject(new Error("Unable to create or find target element"));
    });

    await targetElementPromise
      .then(async (targetElement) => {
        try {
          if (htmlPath) {
            await ë.htmlFileLoader(
              {
                htmlPath,
                cssPath,
                originFunction,
                functionFile,
                passedFunction,
              },
              async (htmlContent) => {
                console.log(targetElement);

                await ë.updateContent(
                  htmlContent,
                  targetElement,
                  false,
                  functionFile
                );
              }
            );
          } else {
            console.log("updatecontent no functionhtml");
            console.log(targetElement);
            resolve(vanillaPromise);
          }
        } catch (error) {
          ë.logSpacer(
            console.error(
              "An error occurred while loading and updating HTML content:",
              error
            ),
            null,
            true
          );
        }
      })
      .catch((error) => {
        ë.logSpacer(
          console.error(
            "An error occurred while loading and updating HTML content:",
            error
          ),
          null,
          true
        );
      });
  }
);
ë.frozenVanilla(
  "updateContent",
  function (functionHTML, targetElement, cached, functionFile) {
    try {
      if (functionHTML) {
        targetElement.innerHTML = functionHTML;

        ë.updateVanillaPromise(
          vanillaPromise,
          targetElement,
          functionHTML,
          functionFile,
          cssPath,
          originFunction,
          resolve
        );
      } else {
        throw new Error("nohtml");
      }
    } catch (error) {
      ë.vanillaMess(
        "[domBuild.js] ë.updateContent for function " + functionFile + ".js",
        [functionHTML, targetElement],
        "array"
      );
    }
  }
);
ë.frozenVanilla(
  "createNewElement",
  async function (container, classNames, passedFunction) {
    //alert("createNewElement " + JSON.stringify(passedFunction));
    try {
      let targetElement = document.getElementById(container);

      let isNewElement;
      if (!targetElement) {
        targetElement = document.createElement("div");
        isNewElement = true;
      }

      targetElement.id = container;
      targetElement.setAttribute("nonce", ë.nonceBack());
      targetElement.classList.remove(`${container}`);
      targetElement.classList.add(`${container}-wrapper`);
      targetElement.innerHTML = `<div id="${container}Container" class="${container}"></div>`;
      targetElement.setAttribute("data-component", true);

      if (isNewElement === true) {
        if (document.body.childNodes.length > 0) {
          document.body.appendChild(targetElement);
        } else {
          document.body.appendChild(targetElement);
        }
      } else {
        targetElement.innerHTML = targetElement.innerHTML;
      }

      if (classNames) {
        let classNameList = classNames.trim().replace(/\s+/g, " ").split(" ");
        for (let className of classNameList) {
          targetElement.classList.add(className);
        }
      }

      return targetElement.querySelector(`.${container}`);
    } catch (error) {
      ë.vanillaMess(
        "[domBuild.js] Creating new element Error for function " +
          functionFile +
          ".js",
        [container, classNames],
        "array"
      );
    }
  }
);

ë.frozenVanilla(
  "updateVanillaPromise",
  async function (
    vanillaPromise,
    targetElement,
    safeHTML,
    functionFile,
    cssPath,
    originFunction,
    resolve
  ) {
    //TODO: reimplement signalUpdates here. See signalBurstDOM.js in directory ./vanillaDOM/processors
    try {
      function mergeOriginBursts(existingBurst, newBurst) {
        return { ...existingBurst, ...newBurst };
      }

      let updatedOriginBurst = ë.storeBurstOrigin(
        vanillaPromise,
        safeHTML,
        functionFile,
        originFunction
      );
      vanillaPromise.originBurst = updatedOriginBurst;

      let existingOriginBurst =
        JSON.parse(localStorage.getItem("originBurst")) ||
        vanillaPromise.originBurst;

      let existingHTML =
        existingOriginBurst?.[originFunction]?.[functionFile]?.htmlResult || "";

      let sanitizedInitialHTML = safeHTML;
      if (sanitizedInitialHTML !== existingHTML || existingHTML === "") {
        let combinedOriginBurst = mergeOriginBursts(
          existingOriginBurst,
          vanillaPromise.originBurst
        );
        localStorage.setItem(
          "originBurst",
          JSON.stringify(combinedOriginBurst)
        );
      }
      resolve(vanillaPromise);
    } catch (error) {
      ë.vanillaMess(
        "[domBuild.js] ë.updateContent: an error occurred updating vanillaPromise " +
          customFunctionName +
          ".js",
        [
          vanillaPromise,
          targetElement,
          safeHTML,
          functionFile,
          cssPath,
          originFunction,
        ],
        "array"
      );
    }
  }
);
