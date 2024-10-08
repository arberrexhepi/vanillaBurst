/**
 * Updates the originBurst object with the provided function data.
 *
 * @param {Object} renderSchema - The schema defining the views and functions to render.
 * @param {String} functionName - The name of the custom function being processed.
 * @param {Object} passedFunction - The function definition from the renderSchema.
 * @param {Object} fullServerResult - The full result from the server for the function.
 * @param {Object} originBurst - The current state of the originBurst object.
 * @returns {Object} Updated originBurst object.
 * @global
 *
 * @throws {Error} If an invalid renderSchema or missing landing key is provided.
 */
ë.frozenVanilla(
  "updateOriginBurst",
  function (
    renderSchema,
    functionName,
    passedFunction,
    fullServerResult,
    originBurst
  ) {
    if (!originBurst) {
      originBurst = {};
    }

    // Validate the renderSchema and ensure it has a landing property
    if (!renderSchema || !renderSchema.landing) {
      ë.logSpacer(
        console.error("Invalid renderSchema or missing landing key.")
      );
      return originBurst;
    }

    const landingKey = renderSchema.landing;

    // Initialize the landing key in originBurst if not already present
    if (!originBurst[landingKey]) {
      ë.logSpacer({
        Status: "BUILDING originBurst Object",
        Scope: landingKey,
      });

      originBurst[landingKey] = {};
    }

    // Initialize the function name entry under the landing key if not already present
    if (!originBurst[landingKey][functionName]) {
      ë.logSpacer({
        Status: "...Spreading customFunctions originBurst",
        Scope: `${landingKey} > ${functionName}`,
      });

      originBurst[landingKey][functionName] = {
        fromSchema: passedFunction?.originBurst || null,
        namespace: passedFunction?.originBurst?.namespace || landingKey,
        serverResult: null,
        htmlResult: null,
        burst: true,
      };

      ë.logSpacer();
      ë.logSpacer(
        `${functionName} initial originBurst entry; New build complete.`
      );
    } else {
      ë.logSpacer();
      ë.logSpacer(
        `${functionName} initial originBurst entry: Found existing.`,
        null,
        null,
        true
      );
    }

    ë.logSpacer(
      {
        Status: "Custom function's originBurst ready...",
        functionFile: functionName,
      },
      null,
      null,
      true
    );

    ë.logSpacer(
      { Result: originBurst[landingKey][functionName] },
      null,
      null,
      true
    );
    let getLocalOriginBurst = JSON.parse(localStorage.getItem("originBurst"));

    if (
      getLocalOriginBurst &&
      typeof originBurst === "object" &&
      originBurst !== null
    ) {
      let updatedOriginBurst = { ...getLocalOriginBurst, ...originBurst };
      localStorage.setItem("originBurst", JSON.stringify(updatedOriginBurst));
    } else if (typeof originBurst === "object" && originBurst !== null) {
      localStorage.setItem("originBurst", JSON.stringify(originBurst));
    }
    // Return the updated originBurst
    return originBurst;
  }
);

/**
 * Updates the originBurst object with the server result.
 *
 * @param {Object} renderSchema - The schema defining the views and functions to render.
 * @param {String} functionName - The name of the custom function being processed.
 * @param {Object} passedFunction - The function definition from the renderSchema.
 * @param {Object} originBurst - The current state of the originBurst object.
 * @param {Object} serverResult - The server result for the function.
 * @returns {Object} Updated originBurst object.
 * @global
 *
 * @throws {Error} If an invalid renderSchema or missing landing key is provided.
 */
ë.frozenVanilla(
  "setOriginBurst",
  function (
    renderSchema,
    functionName,
    passedFunction,
    originBurst,
    serverResult
  ) {
    return new Promise((resolve, reject) => {
      if (!renderSchema || !renderSchema.landing) {
        ë.logSpacer(
          console.error("Invalid renderSchema or missing landing key."),
          null,
          null,
          true
        );
        resolve(originBurst);
        return;
      }

      const landingKey = renderSchema.landing;

      // Ensure the originBurst object and its structure are properly initialized
      if (!originBurst) {
        originBurst = {};
      }

      if (!originBurst[landingKey]) {
        originBurst[landingKey] = {};
      }

      if (!originBurst[landingKey][functionName]) {
        originBurst[landingKey][functionName] = {
          serverResult: null,
          htmlResult: null,
          burst: true,
        };
      }

      // Update the serverResult in the originBurst
      originBurst[landingKey][functionName].serverResult =
        serverResult ||
        originBurst[landingKey][functionName].serverResult ||
        null;

      ë.logSpacer(
        {
          Update: "New serverResult:",
          customFunction: functionName,
        },
        null,
        null,
        true
      );

      ë.logSpacer({ Result: originBurst[landingKey][functionName] });
      resolve(originBurst);
      //return;
    });
  }
);
/**
 * Stores the HTML result into the originBurst object.
 *
 * @param {Object} vanillaPromise - The promise object containing renderSchema and originBurst information.
 * @param {String} functionHTML - The sanitized HTML result to be stored.
 * @returns {Object} Updated originBurst object.
 * @global
 *
 * @throws {Error} If originBurst is not available or cannot find an htmlResult for the function.
 */
ë.frozenVanilla(
  "storeBurstOrigin",
  function (vanillaPromise, functionHTML, functionFile, originFunction) {
    let originBurst =
      JSON.parse(localStorage.getItem("originBurst")) ||
      vanillaPromise.originBurst;

    let functionName = functionFile;
    // alert(functionHTML);
    if (!originBurst) {
      ë.logSpacer(
        console.error("originBurst is not available."),
        null,
        null,
        true
      );
      return originBurst;
    }

    // Ensure the originBurst object and its nested structure are properly initialized
    if (!originBurst[originFunction]) {
      originBurst[originFunction] = {};
    }

    if (!originBurst[originFunction][functionName]) {
      originBurst[originFunction][functionName] = {
        serverResult: null,
        htmlResult: functionHTML,
        burst: true,
      };
    }

    originBurst[originFunction][functionName].htmlResult = functionHTML;

    return originBurst;
  }
);

ë.frozenVanilla(
  "storeComponentBurst",
  function (originBurst, originFunction, functionFile, DOMtype) {
    if (
      DOMtype &&
      DOMtype.type?.component &&
      DOMtype.type.component.length >= 2
    ) {
      // Initialize originBurst.componentBurst if it doesn't exist
      if (!originBurst.componentBurst) {
        originBurst.componentBurst = {};
      }

      if (!originBurst.componentBurst?.verbose) {
        originBurst.componentBurst.verbose = {};
      }

      // Initialize originBurst.componentBurst[functionFile] if it doesn't exist

      // Add or update the component
      originBurst.componentBurst[DOMtype.type.component[0]] = {
        id: DOMtype.type.component[0],
        htmlResult: DOMtype.type.component[1],
      };

      // console.log(
      //   "this is the originburst at AFTER componentburst" +
      //     JSON.stringify(originBurst)
      // );
    }
    return originBurst;
  }
);
