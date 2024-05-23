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
 * window.updateComponent(
 *   vanillaPromise, // Required. This should be a promise object.
 *   componentPrep, // Required. This should be an object containing the component preparation data.
 *   "componentKey", // Required. This should be a string representing the component key.
 *   ".target-class" || "#targetId.targetClass1.targetClass2", // Optional but more stable if provided. This should be a string representing the target selector.
 *   function() { console.log("Component updated!") } // Callback. Optional. This should be a function to be executed after the component update.
 * );
 */

window.frozenVanilla(
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
    let storedComponentId =
      `${vanillaPromise?.passedFunction?.components?.[componentKey]?.id}-${vanillaPromise?.renderSchema?.landing}_${vanillaPromise?.this}` ||
      undefined;

    ////////////////////////////////////
    const getTarget = treatRoot(target, componentPrep, vanillaPromise);

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

    function treatRoot(target, componentPrep, vanillaPromise) {
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
            position: componentPrep.position,
            clear: componentPrep.clear,
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
              console.log(`No element matches the selector: ${selector}`);
              return;
            }
            return element;
            break;
        }
      } catch (error) {
        console.log(error);
      }
    }

    function treatId(selector) {
      try {
        const componentRoot = document.getElementById(selector);
        if (componentRoot) {
          componentRoot.classList.add("componentRoot");
          // componentRoot.innerHTML(html);
          console.log(componentRoot);
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

    ///////////////////////////////////
    ///////Build
    existingParts()
      .then(async () => {
        // Convert NodeList to array
        let htmlData = rootObject?.htmlData;
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
            try {
              if (
                vanillaPromise.passedFunction.components[componentKey].cache ===
                false
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
              console.trace();
              console.log(error);
              reject(error);
            }
          }).catch((error) => {
            throw new Error("Awaiting cacheComopnentSpawn: " + error.message);
          });
        } else {
          console.log(vanillaPromise.passedFunction);
          console.log(componentKey);
          if (
            vanillaPromise.passedFunction.components[componentKey].cache ===
            false
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
      //assuming clear=true, position 0
      let element = document.getElementById(htmlData.selector).cloneNode();
      document.getElementById(htmlData.selector).remove();
      //let element = document.createElement(htmlData.tag || "div");
      element.innerHTML = content;
      parentElement.appendChild(element);
    }

    function treatSpawn(htmlData, parentElement) {
      let index = htmlData.position || 0;

      let selectorID = null;
      let selectorClass = null;

      if (htmlData.selector.startsWith("#")) {
        selectorID = htmlData.selector.split("#")[1].split(".")[0];
        selectorClass = htmlData.selector.split(".").slice(1);
      } else if (htmlData.selector.startsWith(".")) {
        selectorClass = htmlData.selector.split(".")[1];
      }

      let tag = htmlData.tag || "div";

      // Wrap each HTML string with the specified tag
      let wrappedHtml = htmlData.html
        .map(
          (content) =>
            `<${tag} id=${selectorID} class=${selectorClass}>${content}</${tag}>`
        )
        .join("");

      // Create a new DOMParser
      let parser = new DOMParser();

      // Parse the wrapped HTML strings into a DocumentFragment
      let fragment = parser.parseFromString(wrappedHtml, "text/html").body;

      // If clear is true, remove children from index to the end
      // Convert the children of parentElement to an array
      let childrenArray = Array.from(parentElement.children);

      console.log("childrenArray length " + childrenArray.length);
      if (index === -1) {
        index = childrenArray.length;
      } else if (!index) {
        index = childrenArray.findIndex(
          (child) =>
            child.tagName.toLowerCase() === (htmlData.tag || "div") &&
            (child.classList.contains(selectorClass) || child.id === selectorID)
        );
        // If an element was found, remove it
        if (index !== -1) {
          childrenArray.splice(index, 1);
        }
      } else {
        let firstTagIndex = childrenArray.findIndex(
          (child) =>
            child.tagName.toLowerCase() === (htmlData.tag || "div") &&
            (child.classList.contains(selectorClass) || child.id === selectorID)
        );

        // If a tag was found, offset index by its position
        if (firstTagIndex !== -1) {
          index += firstTagIndex;
        }
      }

      // If clear is true, remove children from index to the end
      if (htmlData.clear === true || htmlData.clear === undefined) {
        childrenArray = childrenArray.slice(0, index);
      }
      console.log("childrenArray length sliced " + childrenArray.length);

      // Insert the new HTML at the specified index
      childrenArray.splice(index, 0, ...Array.from(fragment.children));

      // Combine the outerHTML of all children
      let combinedHtml = childrenArray.map((child) => child.outerHTML).join("");

      // Set the innerHTML of parentElement to the combined HTML
      parentElement.innerHTML = combinedHtml;
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
        console.log("Data to store:", storedData);
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
            console.log(error);
            throw error;
          }
        } else {
          localStorage.setItem("originBurst", JSON.stringify(storedData));
        }

        console.log(
          "Stored data:",
          JSON.parse(localStorage.getItem("originBurst"))
        );
      } catch (error) {
        throw new Error("Caching: " + error.message);
      }
    }
  }
);
