const config = window.frozenVanilla(
  "config",
  function () {
    let schema = {};

    for (let part in window.schemaParts) {
      if (window.schemaParts.hasOwnProperty(part)) {
        let packageNames = window.schemaParts[part];
        if (
          packageNames === false ||
          packageNames === true ||
          typeof packageNames === "string"
        )
          continue; // Skip non-views

        let partConfig = window[`${part}Config`]
          ? window[`${part}Config`]()
          : {};
        let customFunctions = partConfig.customFunctions || {};

        // If packageNames is a string, treat it as a direct function config call
        // if (typeof packageNames === "string") {
        //   let funcNameConfig = `${packageNames}Config`;
        //   if (typeof window[funcNameConfig] === "function") {
        //     let result = window[funcNameConfig]();
        //     if (result && typeof result === "object") {
        //       Object.assign(customFunctions, result);
        //     }
        //   } else {
        //     console.error(
        //       `Function ${funcNameConfig} not found. Check naming consistencys between: globals/config.js schemaParts, Schema directory filename, and function name consistancy. Expected: ${funcNameConfig}`
        //     );
        //   }
        // }

        // If packageNames is an array, process it as a package
        if (Array.isArray(packageNames)) {
          packageNames.forEach((packageName) => {
            let individualPackageNames = packageName.includes(",")
              ? packageName.split(",").map((name) => name.trim())
              : [packageName];

            individualPackageNames.forEach((individualPackageName) => {
              let functionNames = window[individualPackageName];
              if (Array.isArray(functionNames)) {
                functionNames.forEach((funcName) => {
                  let funcNameConfig = `${funcName}Config`;
                  if (typeof window[funcNameConfig] === "function") {
                    let result = window[funcNameConfig](part);
                    if (result && typeof result === "object") {
                      // Directly merge into the customFunctions object
                      Object.assign(customFunctions, result);
                    }
                  } else {
                    console.error(
                      `Function ${funcNameConfig} not found. Check naming consistencys between: globals/config.js schemaParts, Schema directory filename, and function name consistancy. Expected: ${funcNameConfig}`
                    );
                  }
                });
              }
            });
          });
        }

        // Assign the constructed customFunctions to the partConfig
        partConfig.customFunctions = customFunctions;
        schema[part] = partConfig;
      }
    }

    console.log("Schema built:", schema);
    return schema;
  },
  false
);

const vanillaConfig = window.frozenVanilla(
  "vanillaConfig",
  function vanillaConfig(landing, passedConfig, passedVendors) {
    function freezeConfig(passedConfig, propertyToFreeze) {
      for (let key in passedConfig) {
        if (
          typeof passedConfig[key] === "object" &&
          passedConfig[key] !== null
        ) {
          freezeConfig(passedConfig[key], propertyToFreeze);
        }
        if (key === propertyToFreeze) {
          Object.defineProperty(passedConfig, propertyToFreeze, {
            value: passedConfig[propertyToFreeze],
            writable: false,
            configurable: false,
          });
        }
      }
    }

    window.frozenVanilla("freezeConfig", freezeConfig, false);
    freezeConfig(passedConfig, "originBurst");

    window.frozenVanilla("passedVendors", passedVendors, false);

    let landingRequest = landing + "Request";
    let buildConfig = {};
    //window.passedConfig = passedConfig;
    buildConfig[landing] = {
      landing: landing,
      scripts: [
        ...window.vanillaBurstScripts,
        ...(Array.isArray(passedVendors) ? passedVendors : []),
      ], // Array of required script paths
      preloader: window.baseUrl + "preloader.js", // Assuming this path is correct
      customFunctions: {
        //this is what the passedConfig is building out, which comes from schemas/ folder let's say homeConfig.js
        // example: {
        //   dir: "client/views/journey/",
        //   functionFile: "example",
        //   render: "pause",
        //   originBurst: {
        //     somevalue: "",
        //     someobj: {},
        //     somearray:[]
        //   },

        ...passedConfig,
      },
    };
    // Freeze the 'landing' property
    Object.defineProperty(buildConfig[landing], "landing", {
      writable: false,
      configurable: false,
    });

    // Freeze the 'scripts' property
    Object.defineProperty(buildConfig[landing], "scripts", {
      writable: false,
      configurable: false,
    });

    // Continue freezing other properties as needed...

    return buildConfig[landing];
    //(JSON.stringify(buildConfig[landing]));
  },
  false
);

window.frozenVanilla(
  "buildRollCall",
  async function buildRollCall(rollCall, renderSchema, runFunction) {
    //custom call, depending on reload requirements, or refresh, helper function
    if (runFunction === "functionBurst") {
      //runFunction = ''
      runRoll = "rollBurst";
      window.childFunction(renderSchema, rollCall, runRoll);
    }
  }
);
