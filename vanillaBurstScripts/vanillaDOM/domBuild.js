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
    const htmlPath = ë.baseUrl + passedFunction.htmlPath;
    const cssPath = passedFunction.cssPath
      ? ë.baseUrl + passedFunction.cssPath
      : null;
    const container = passedFunction.container;
    const classNames = passedFunction.classNames;

    let originBurst = vanillaPromise.originBurst;

    const targetElementPromise = new Promise((resolve, reject) => {
      originBurst = JSON.parse(localStorage.getItem("originBurst")) || {};
      let element = ë.createNewElement(container);

      ///within this function we could check for cache:true, false, dynamic or whatever else to resolve in this promise to be passed to htmlFileLoader()
      if (!originBurst?.[originFunction]?.[functionFile]?.htmlResult) {
        //handle potential future features
      } else {
        //handle potential future features
      }

      element
        ? resolve(element)
        : reject(new Error("Unable to create or find target element"));
    });

    targetElementPromise
      .then((targetElement) => {
        ë.htmlFileLoader(
          { htmlPath, cssPath, originFunction, functionFile },
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
        // Parse the HTML string into a DOM structure
        try {
          let parser = new DOMParser();
          let doc = parser.parseFromString(functionHTML, "text/html");

          // If doc is not defined, create a new div and set its innerHTML to functionHTML
          if (!doc) {
            let div = document.createElement("div");
            div.innerHTML = functionHTML;
            doc = div;
          }

          // Add a nonce to img tags
          let imgTags = doc.getElementsByTagName("img");
          for (let img of imgTags) {
            let nonceString = ë.nonce();
            ë.nonceBack(nonceString);
            img.setAttribute("nonce", nonceString);
          }

          // // Serialize the DOM structure back into a string
          let serializer = new XMLSerializer();
          let serializedHTML = serializer.serializeToString(doc);
          functionHTML = serializedHTML;
        } catch (error) {
          console.error(
            "An error occurred while parsing the HTML, adding nonces to img elements, and serializing the HTML:",
            error
          );
        }
        if (classNames) {
          let classNameList = classNames.split(" ");
          for (let className of classNameList) {
            targetElement.classList.add(className);
          }
        }

        // Set the innerHTML of the target element
        targetElement.innerHTML = functionHTML;

        //alert("here is " + functionHTML);
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

ë.frozenVanilla("createNewElement", async function (container) {
  //alert(container);
  let targetElement = document.getElementById(container);
  if (!targetElement) {
    targetElement = document.createElement("div");

    targetElement.id = container;
    targetElement.setAttribute("nonce", ë.nonceBack());
    document.body.appendChild(targetElement);
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
