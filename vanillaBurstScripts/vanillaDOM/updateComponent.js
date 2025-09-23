/**
 * Updates a component in the DOM with componentPrep and stores this in cache strategy.
 *
 * @param {Object} vanillaPromise - The vanillaPromise object.
 * @param {Object} componentPrep - The component preparation object.
 * @param {string} componentKey - The component key.
 * @param {string} [target] - The target selector. Optional but more stable if provided.
 * @param {Function} [callback] - The callback function to be executed after the component update. Optional.
 *
/**
 * @example
 * let componentPrep = {
 *   position: i || 0 || -1, // Position of the component. Optional, defaults to 0 if not set.
 *   clear: true || false, // Whether to clear the component. Optional, defaults to true if not set.
 *   tag: "div", // The HTML tag of the component.
 *   html: ["<p>Hello, world!</p>"], // The HTML content of the component. Type requirement is array even if it's a single string.
 * };
 * ë.updateComponent(
 *   vanillaPromise, // Required. This should be a promise object.
 *   componentPrep, // Required. This should be an object containing the component preparation data.
 *   "componentKey", // Required. This should be a string representing the component key.
 *   ".target-class" || "#targetId.targetClass1.targetClass2", // Optional but more stable if provided. This should be a string representing the target selector.
 *   function() { console.log("Component updated!") } // Callback. Optional. This should be a function to be executed after the component update.
 * );
 */

ë.frozenVanilla(
  "updateComponent",
  async function (
    vanillaPromise,
    componentPrep,
    componentKey,
    target,
    callback,
    verbose
  ) {
    ///
    /////////Aquiring Target
    //////////////////////////////////////////////////////////
    let verboseCache = true;
    ///////////////////////////////////
    let checkComponentRole;
    let defaultComponentKey;

    if (vanillaPromise?.passedFunction?.role === "component") {
      checkComponentRole = true;
      defaultComponentKey = vanillaPromise.this + "-componentContainer";
    }

    // True/false ternary for storedComponentId
    let storedComponentId = vanillaPromise?.passedFunction?.components?.[
      componentKey
    ]?.id
      ? `${vanillaPromise.passedFunction.components[componentKey].id}-${vanillaPromise?.renderSchema?.landing}_${vanillaPromise?.this}`
      : defaultComponentKey;

    ë.vanillaMess(
      "updateComponent",
      "logging htmlData",
      storedComponentId,
      "check"
    );

    ////////////////////////////////////
    const getTarget = treatRoot(
      target,
      storedComponentId,
      componentPrep,
      vanillaPromise
    );

    const rootObject =
      getTarget && typeof getTarget === "object"
        ? getTarget
        : () => {
            throw new Error(getTarget);
          };

    // console.log("rootObject", rootObject);

    let existingParts = async () => await rootObject.domElement();
    let swarmLength = rootObject?.html?.length;
    let insertAt = rootObject?.insert || "after";

    let HTMLUpdateReady;

    /////// target functions /////////////////////////////////

    function treatRoot(
      target,
      storedComponentId,
      componentPrep,
      vanillaPromise
    ) {
      try {
        let component;
        let html;
        let htmlDataType;

        if (!target) {
          target = storedComponentId;
          component = "root";
        } else {
          component = "part";
        }

        let htmlCheck = (componentPrep) => {
          htmlDataType;
          if (Array.isArray(componentPrep.html)) {
            htmlDataType = "array";
          } else if (typeof componentPrep.html === "string") {
            htmlDataType = "string";
          } else {
            htmlDataType = "unknown";
          }

          switch (htmlDataType) {
            case "array":
              // Handle array case
              return componentPrep.html;

            case "string":
              // Handle string case
              return componentPrep.html;

            default:
              throw new Error(
                "Html data is of the wrong type. You can set a simple String or an Array of strings for multiple parts."
              );
          }
        };

        try {
          html = htmlCheck(componentPrep);
        } catch (error) {
          console.error(
            "Html data is of the wrong type. You can set a simple String or an Array of strings for multiple parts." +
              error
          );
          throw error; // Re-throw the error after logging it
        }
        return {
          domElement: () => getTargetContainer(target),
          component: component,
          htmlData: {
            tag:
              componentPrep.tag && typeof componentPrep.tag === "string"
                ? componentPrep.tag
                : undefined,
            selector: target,
            position: componentPrep?.position ? componentPrep?.position : 0,
            classNames: componentPrep?.classNames
              ? componentPrep?.classNames
              : "",
            clear: componentPrep?.clear ? componentPrep.clear : true,
            htmlDataType: htmlDataType,
            html: html,
            callBack:
              componentPrep.callBack && typeof componentPrep === "function"
                ? componentPrep.callBack
                : null,
          },
        };
      } catch (error) {
        return `Error name: ${error.name}\nError message: ${error.message}\nStack trace: ${error.stack}`;
      }
    }

    // Function to get the target container
    async function getTargetContainer(selector) {
      try {
        let selectorType = (selector) => {
          if (selector && typeof selector === "string") {
            if (selector.startsWith("#")) {
              return "id";
            } else if (selector.startsWith(".")) {
              return "class";
            }
          }
          return null;
        };

        switch (selectorType(selector)) {
          case "id":
          case "class":
            let element = document.querySelector(selector);
            if (!element) {
              ë.logSpacer(
                console.log(
                  `No element matches the selector: ${selector}, please check your functionConfig.js or HTML`,
                  null,
                  null,
                  true
                )
              );
              return;
            }
            return element;
            break;
        }
      } catch (error) {
        ë.logSpacer(console.log(error), null, null, true);
      }
    }

    ////Currently stale but leaving it here. As I do like it for an earlier check, will stop at first existing call
    ////providing a quicker feedback on selector exist
    function treatId(selector) {
      try {
        const componentRoot = document.getElementById(selector);
        if (componentRoot) {
          componentRoot.classList.add("componentRoot");
          // componentRoot.innerHTML(html);
          ë.logSpacer(console.log(componentRoot), null, null, true);
          return componentRoot;
        }
      } catch (error) {
        throw error;
      }
    }

    function treatClass(selector, htmlData) {
      let componentParts = document.querySelectorAll(selector);
      if (componentParts.length > 0) {
        componentParts.forEach((element, index) => {
          element.classList.add("componentPart");
        });
      }
      return componentParts;
    }
    ///end stale

    ///////////////////////////////////
    ///////Build
    existingParts()
      .then(async () => {
        // Convert NodeList to array
        let htmlData = rootObject?.htmlData;
        console.log("storedComponentId", storedComponentId);
        let parentElement = document.querySelector("#" + storedComponentId);

        switch (htmlData.htmlDataType) {
          case "array":
            treatSpawn(htmlData, parentElement);
            break;
          case "string":
            treatSimple(htmlData, parentElement);
            break;
        }

        if (verbose === true) {
          return new Promise(async (resolve, reject) => {
            let cacheResult;
            console.log(vanillaPromise.passedFunction);
            try {
              if (
                vanillaPromise.passedFunction?.components?.[
                  componentKey ?? storedComponentId
                ]?.cache &&
                vanillaPromise.passedFunction.components[
                  componentKey ?? storedComponentId
                ] === false
              ) {
                return;
              } else {
                await cacheComponentSpawn(parentElement);
              }
              if (
                htmlData.callBack &&
                typeof htmlData.callBack === "function"
              ) {
                htmlData.callBack(htmlData.selector);
              }
              resolve(cacheResult); // resolve the Promise with cacheResult
            } catch (error) {
              console.error("Error in cacheComponentSpawn: " + error.message);
              console.trace();
              ë.logSpacer(console.log(error), null, null, true);
              reject(error);
            }
          }).catch((error) => {
            throw new Error("Awaiting cacheComponentSpawn: " + error.message);
          });
        } else {
          ë.logSpacer(vanillaPromise.passedFunction, null, null, true);
          ë.logSpacer(componentKey, null, null, true);
          if (
            vanillaPromise.passedFunction?.components?.[
              componentKey ?? storedComponentId
            ]?.cache &&
            vanillaPromise.passedFunction.components[
              componentKey ?? storedComponentId
            ] === false
          ) {
            return;
          } else {
            await cacheComponentSpawn(parentElement);
          }
        }
      })
      .catch((error) => {
        throw new Error("Promising rootObject: " + error.message);
      });

    function treatSimple(htmlData, parentElement) {
      // Assuming clear=true, position 0
      const targetElement = document.querySelector(htmlData.selector);
      if (!targetElement) {
        console.error(`Element with selector ${htmlData.selector} not found.`);
        return;
      }
      if (htmlData.clear) {
        targetElement.innerHTML = ""; // Clear the content of the target element
      }
      ë.vanillaMess(
        "updateComponent",
        "logging htmlData at clear",
        htmlData,
        "check"
      );

      // Assuming content is an array of strings
      const content = htmlData.html.join(""); // Combine array into a single string if needed
      targetElement.innerHTML = content;
    }

    function treatSpawn(htmlData, parentElement) {
      // Identify the target element within the parentElement
      const targetElement = parentElement.querySelector(htmlData.selector);

      // Use ë.vanillaMess to check and log the target element
      ë.vanillaMess(
        "updateComponent",
        "Checking target element",
        [htmlData.selector, targetElement],
        "check"
      );

      if (!targetElement) {
        // Log an error using ë.vanillaMess
        ë.vanillaMess(
          "updateComponent",
          `Element with selector ${htmlData.selector} not found within the parentElement.`,
          [htmlData.selector],
          "check"
        );
        return;
      }

      // Determine the ID and class for the selector
      let selectorID = null;
      let selectorClass = [];

      if (htmlData.selector.startsWith("#")) {
        selectorID = htmlData.selector.split("#")[1].split(".")[0];

        selectorClass = selectorID;
      } else if (htmlData.selector.startsWith(".")) {
        selectorClass = htmlData.selector.split(".").slice(1);
      }

      // Use ë.vanillaMess to check and log the selector details
      ë.vanillaMess(
        "updateComponent",
        "Selector details",
        [selectorID, selectorClass],
        "check"
      );

      let tag = htmlData.tag || "div";
      let classNames = htmlData.classNames || "";

      // Wrap each HTML string with the specified tag

      // if(tag){
      //   content = ``
      // }
      let wrappedHtml = htmlData.html
        .map((content, index) => {
          if (tag) {
            if (classNames) {
              return `<${tag} class="${classNames}">${content}</${tag}>`;
            } else {
              console.error(
                "It is recommended to add a classNames property to a component spawn"
              );
              // return;
            }
          }
          return content;
        })
        .join("");

      // Use ë.vanillaMess to check the wrapped HTML content
      ë.vanillaMess(
        "updateComponent",
        "Wrapped HTML content",
        [wrappedHtml],
        "check"
      );

      // Create a new DOMParser
      let parser = new DOMParser();

      // Parse the wrapped HTML strings into a DocumentFragment
      let fragment = parser.parseFromString(wrappedHtml, "text/html").body;

      // Use ë.vanillaMess to check the parsed fragment
      ë.vanillaMess("updateComponent", "Parsed fragment", [fragment], "check");

      // If clear is true, remove children of the targetElement
      if (htmlData.clear === true || htmlData.clear === undefined) {
        targetElement.innerHTML = ""; // Clear only the specific target element

        // Log the clearing action
        ë.vanillaMess(
          "updateComponent",
          "Cleared content of the target element",
          [htmlData.selector, targetElement],
          "check"
        );
      }

      // Append the new content inside the target element as separate siblings
      while (fragment.firstChild) {
        targetElement.appendChild(fragment.firstChild);
      }

      // Use ë.vanillaMess to check the final state of the target element after content insertion
      ë.vanillaMess(
        "updateComponent",
        "Final state after content insertion",
        [targetElement.outerHTML, targetElement],
        "check"
      );
    }

    ////build//////////////////////////////////////////////

    // throw new Error("TEST PAUSE");
    async function cacheComponentSpawn(parentElement) {
      try {
        let storedData = JSON.parse(localStorage.getItem("originBurst"));
        if (!storedData.componentBurst[storedComponentId]) {
          storedData.componentBurst[storedComponentId] = {};
        }
        let HTMLUpdateReady = parentElement.innerHTML;

        storedData.componentBurst[storedComponentId].htmlResult =
          HTMLUpdateReady;
        ë.logSpacer("Data to store:", storedData, null, null, true);
        if (verboseCache === true) {
          try {
            let originBurst = localStorage.getItem("originBurst");
            let parsedOriginBurst = JSON.parse(originBurst);
            let componentBurst = parsedOriginBurst.componentBurst;
            let componentBurstLog = componentBurst["configresult-gen_gen"];

            let data = storedData.componentBurst[storedComponentId]; // replace 'originBurst' with the key of your data
            let storageSizeBytes = new Blob([data]).size;
            let storageSizeKB = storageSizeBytes / 1024;
            let storageSizeMB = storageSizeKB / 1024;
            let storageSizeKBLog = storageSizeKB.toFixed(2) + " KB";
            let storageSizeMBLog = storageSizeMB.toFixed(2) + " MB";

            let verboseResult = `Storage size: ${storageSizeKBLog}\nStorage size: ${storageSizeMBLog}\nComponent Burst: ${componentBurstLog}`;
            // Now 'result' contains the string you want
            if (!storedData.componentBurst) {
              storedData.componentBurst = {};
            }

            storedData.componentBurst.verbose = verboseResult;
            localStorage.setItem("originBurst", JSON.stringify(storedData));
          } catch (error) {
            ë.logSpacer(console.log(error), null, null, true);
            throw error;
          }
        } else {
          localStorage.setItem("originBurst", JSON.stringify(storedData));
        }

        ë.logSpacer(
          "Stored data:",
          JSON.parse(localStorage.getItem("originBurst"), null, true)
        );
      } catch (error) {
        throw new Error("Caching: " + error.message);
      }
    }
  }
);
