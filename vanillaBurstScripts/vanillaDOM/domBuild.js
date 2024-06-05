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

          resolve(vanillaPromise);
        } catch (error) {
          ë.logSpacer(
            console.warn(
              "If you were expecting DOM here, vanillaPromise was resolved by default and rendering will continue. This currently processes all renderSchema.customFunctions keys. Please make sure you were not expecting DOM rendered from " +
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
      const classNames = passedFunction?.classNames;
      let element = ë.createNewElement(container, classNames);

      ///within this function we could check for cache:true, false, dynamic or whatever else to resolve in this promise to be passed to htmlFileLoader()

      element
        ? resolve(element)
        : reject(new Error("Unable to create or find target element"));
    });

    targetElementPromise
      .then((targetElement) => {
        ë.htmlFileLoader(
          { htmlPath, cssPath, originFunction, functionFile, passedFunction },
          (htmlContent) =>
            ë.updateContent(htmlContent, targetElement, false, functionFile)
        );
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

    ë.updateContent = (functionHTML, targetElement, cached, functionFile) => {
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
      }
    };
  }
);

ë.frozenVanilla("createNewElement", async function (container, classNames) {
  //alert(container);
  let targetElement = document.getElementById(container);

  if (!targetElement) {
    targetElement = document.createElement("div");

    targetElement.id = container;
    targetElement.setAttribute("nonce", ë.nonceBack());

    if (document.body.childNodes.length > 0) {
      document.body.insertBefore(targetElement, document.body.firstChild);
    } else {
      document.body.appendChild(targetElement);
    }
  }
  if (classNames) {
    let classNameList = classNames.trim().replace(/\s+/g, " ").split(" ");
    for (let className of classNameList) {
      targetElement.classList.add(className);
    }
  }

  return targetElement;
});

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
    if (sanitizedInitialHTML !== existingHTML) {
      let combinedOriginBurst = mergeOriginBursts(
        existingOriginBurst,
        vanillaPromise.originBurst
      );
      localStorage.setItem("originBurst", JSON.stringify(combinedOriginBurst));
    }

    resolve(vanillaPromise);
  }
);
