window.frozenVanilla(
  "updateOriginBurst",
  function (
    renderSchema,
    functionName,
    passedFunction,
    fullServerResult,
    originBurst
  ) {
    let burst;

    if (!originBurst) {
      originBurst = {};
    }
    let functionResult = functionName + "Result";

    // Make sure we have a valid renderSchema with a landing property
    if (!renderSchema || !renderSchema.landing) {
      console.error("Invalid renderSchema or missing landing key.");
      return;
    }

    const landingKey = renderSchema.landing;
    const functionResultKey = functionName + "Result";

    // Ensure the originBurst object exists and has a property for the landing key
    if (!originBurst[landingKey]) {
      console.info({
        Status: "BUILDING originBurst Object",
        Scope: landingKey,
      });

      console.table({
        Status: "BUILDING originBurst",
        Scope: landingKey,
      });

      originBurst[landingKey] = {};
    }

    // Ensure there is a structure for the functionName under the landing key

    if (!originBurst[landingKey][functionName]) {
      console.log(functionName + " has no originBurst so building");
      console.table({
        Status: "...Spreading customFunctions originBurst",
        Scope: landingKey + " > " + functionName,
      });

      if (!originBurst[landingKey][landingKey]) {
        originBurst[landingKey][functionName] = {
          fromSchema: passedFunction.originBurst || undefined,
          namespace: landingKey, // Assign the landingKey as the namespace if not provided
          serverResult: null, // Default to undefined
          burst: true, // Indicate that this is a new entry
        };
      }
      if (!originBurst[landingKey][functionName]) {
        originBurst[landingKey][functionName] = {
          fromSchema: passedFunction.originBurst || undefined,
          namespace: landingKey, // Assign the landingKey as the namespace if not provided
          serverResult: null, // Default to undefined
          burst: true, // Indicate that this is a new entry
        };
      }
    } else {
      console.log(functionName + " has originBurst so not building");
    }

    // console.info({
    //   Status: "customFunction's originBurst ready...",
    //   functionFile: functionName,
    //   Result: originBurst[landingKey][functionName],
    // });

    //console.table({ Result: originBurst[landingKey][functionName] });
    // Check if the existing namespace is the same as the passedFunction's originBurst
    const isSameOrigin =
      originBurst?.[landingKey]?.[functionName] ===
        passedFunction.originBurst || "";
    originBurst[landingKey][functionName].burst = !isSameOrigin;
    originBurst[landingKey][functionName].burst;
    console.table(
      isSameOrigin
        ? { "Merging origin to scope for": functionName }
        : { "Separating origin for functionName: ": functionName }
    );

    // Object.defineProperty(window, "originBurst", {
    //   value: originBurst,
    //   writable: true,
    //   configurable: true,
    // });
    return originBurst;
  }
);

window.frozenVanilla(
  "setOriginBurst",
  function (
    renderSchema,
    functionName,
    passedFunction,
    originBurst,
    serverResult
  ) {
    console.log("setting originBurst, serverresult");
    // Make sure we have a valid renderSchema with a landing property
    if (!renderSchema || !renderSchema.landing) {
      console.error("Invalid renderSchema or missing landing key.");
      return;
    }

    const landingKey = renderSchema.landing;
    const functionResultKey = functionName + "Result";

    originBurst[landingKey][functionName].serverResult = serverResult;
    originBurst[landingKey][functionName].serverResult || null;
    console.info({
      Update: "New serverResult:",
      customFunction: functionName,
    });

    console.table({ Result: originBurst[landingKey][functionName] });
    return originBurst;
  }
);
window.frozenVanilla(
  "storeBurstOrigin",
  function (originBurst, originFunction, functionFile, safeHTML) {
    // Check localStorage first
    originBurst = originBurst || {};
    originBurst[originFunction] = originBurst[originFunction] || {};
    originBurst[originFunction][functionFile] =
      originBurst[originFunction][functionFile] || {};
    originBurst[originFunction][functionFile].htmlResult = safeHTML;
    return originBurst;
  }
);

window.frozenVanilla(
  "storeComponentBurst",
  function (originBurst, originFunction, functionFile, DOMtype) {
    // Check localStorage first
    // originBurst = originBurst || {};
    // // console.log(
    // //   "this is the originburst at componentburst" + JSON.stringify(originBurst)
    // // );
    // if (!originBurst[originFunction]) {
    //   originBurst[originFunction] = {};
    // }

    // if (!originBurst[originFunction][functionFile]) {
    //   originBurst[originFunction][functionFile] = {};
    // }

    // if (!originBurst[originFunction][functionFile].componentBurst) {
    //   originBurst[originFunction][functionFile].componentBurst = {};
    // }
    if (
      DOMtype &&
      DOMtype.type?.component &&
      DOMtype.type.component.length >= 2
    ) {
      // Initialize originBurst.componentBurst if it doesn't exist
      if (!originBurst.componentBurst) {
        originBurst.componentBurst = {};
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
