const config = ë.frozenVanilla(
  "config",
  async function () {
    let schema = {};
    let schemaParts = ë.frozenVanilla.get("schemaParts");
    const partPromises = Object.keys(schemaParts).map((part) => {
      return new Promise(async (resolve, reject) => {
        if (schemaParts.hasOwnProperty(part)) {
          let packageNames = schemaParts[part];
          if (
            packageNames === false ||
            packageNames === true ||
            typeof packageNames === "string"
          ) {
            resolve(); // Skip non-views
            return;
          }

          let partConfig = ë[`${part}Config`] ? ë[`${part}Config`]() : {};

          let customFunctions = partConfig.customFunctions
            ? partConfig.customFunctions
            : {};

          function flattenVanillaElement(subComponents, result = []) {
            for (let component in subComponents) {
              let componentArray = [component, subComponents];
              result.push(componentArray);
              if (subComponents[component].subComponents) {
                flattenVanillaElement(
                  subComponents[component].subComponents,
                  result
                );
              }
            }
            return result;
          }

          if (Array.isArray(packageNames)) {
            packageNames.forEach((packageName) => {
              let individualPackageNames = packageName.includes(",")
                ? packageName.split(",").map((name) => name.trim())
                : [packageName];

              individualPackageNames.forEach(async (individualPackageName) => {
                let functionNames = ë[individualPackageName];
                if (Array.isArray(functionNames)) {
                  functionNames.forEach(async (funcName) => {
                    let funcNameConfig = `${funcName}Config`;
                    if (typeof ë[funcNameConfig] === "function") {
                      let result = ë[funcNameConfig](part);

                      let relPath;
                      let role = result[funcName]?.role
                        ? result[funcName].role
                        : undefined;

                      if (result[funcName]?.role) {
                        if (role === "shared") {
                          relPath = `client/shared/${funcName}/`;
                        } else if (role === "parent") {
                          relPath = "client/views/";
                        } else if (role === "function") {
                          relPath = "parent"; // regular functions go in parent dir client/view/${renderSchema.landing}/functions
                        } else if (role === "component" || role === "config") {
                          relPath = `client/components/${funcName}/`;
                        }
                      }

                      if (!result?.[funcName]?.dir) {
                        result[funcName]["dir"] = "";
                      }
                      result[funcName].dir = result[funcName].dir
                        ? result[funcName].dir
                        : `${relPath}`;

                      dir = result[funcName].dir;

                      result[funcName].functionFile =
                        result[funcName].functionFile || funcName;

                      if (
                        result[funcName]?.fetchDOM &&
                        result[funcName]?.fetchDOM === true
                      ) {
                        result[funcName].htmlPath =
                          result[funcName].htmlPath ||
                          `${relPath}${funcName}.html`;
                        result[funcName].cssPath =
                          result[funcName].cssPath ||
                          `${relPath}${funcName}.css`;
                        result[funcName].container =
                          result[funcName].container || funcName;
                      }

                      let subComponents =
                        result?.[funcName]?.components?.fetchComponents;
                      if (subComponents) {
                        let flattenedSubComponents =
                          flattenVanillaElement(subComponents);
                        for (let key in flattenedSubComponents) {
                          let subId = flattenedSubComponents[key][0];
                          let { data, dir } =
                            flattenedSubComponents[key][1][subId];
                          if (!dir) {
                            dir = subId;
                          }

                          let fileId, componentId;
                          if (subId.includes("$")) {
                            [fileId, componentId] = subId.split("$");
                          } else {
                            fileId = subId;
                            componentId = subId;
                          }
                          async function loadAndExecuteComponent(
                            ë,
                            dir,
                            fileId,
                            componentId
                          ) {
                            await ë.loadScript(
                              `${ë.fullPath}client/components/${dir}/${fileId}Component.js`
                            );
                            console.log("trying component " + componentId);

                            // Function to check if the component function is defined
                            function getComponentFunc() {
                              return ë[`${fileId}Component`];
                            }

                            // Wait for the component function to be defined
                            async function waitForComponentFunc() {
                              const maxRetries = 10;
                              const delay = 100; // milliseconds
                              let retries = 0;

                              while (retries < maxRetries) {
                                let componentFunc = getComponentFunc();
                                if (typeof componentFunc === "function") {
                                  return componentFunc;
                                }
                                await new Promise((resolve) =>
                                  setTimeout(resolve, delay)
                                );
                                retries++;
                              }

                              throw new Error(
                                `Component function ${fileId}Component is not defined after ${maxRetries} retries.`
                              );
                            }

                            try {
                              let componentFunc = await waitForComponentFunc();
                              componentFunc();
                            } catch (error) {
                              console.error(error.message);
                            }
                          }

                          // Example usage
                          await loadAndExecuteComponent(
                            ë,
                            dir,
                            fileId,
                            componentId
                          );
                          console.log("trying component" + componentId);

                          let newComponentPart;
                          let counter = -1;
                          let buildCountPart = {};

                          if (data && Array.isArray(data)) {
                            data.forEach((item) => {
                              counter++;
                              if (counter === 0) {
                                item["id"] = componentId;
                              } else {
                                item["id"] = componentId + counter.toString();
                              }

                              let thisSubId = fileId;
                              let thispart = ë[`${fileId}Component`](item);

                              // Ensure thispart[thisSubId] is defined
                              if (!thispart[thisSubId]) {
                                thispart[thisSubId] = fileId;
                              }

                              if (!thispart?.[thisSubId]?.id) {
                                thispart[thisSubId]["id"] = item.id;
                              }

                              if (!thispart?.[thisSubId]?.container) {
                                thispart[thisSubId]["container"] =
                                  fileId + "-component";
                              }

                              if (!thispart?.[thisSubId]?.dir) {
                                thispart[thisSubId]["dir"] = fileId;
                              }

                              let count = 1;
                              if (thispart?.[thisSubId]?.count) {
                                thispart[thisSubId]["count"] = count;
                              }
                              buildCountPart = {
                                ...buildCountPart,
                                ...thispart,
                              };
                            });
                          } else {
                            if (componentId) {
                              data["id"] = componentId;
                            }
                            newComponentPart = ë[`${fileId}Component`](data);
                            processNewComponentPart();
                          }

                          function processNewComponentPart() {
                            if (!newComponentPart?.[subId]?.dir) {
                              newComponentPart[subId]["dir"] = dir;
                            }
                            let count = data?.count ? 2 : 1;
                            if (!newComponentPart?.[subId]?.count) {
                              newComponentPart[subId].count = count;
                            }
                          }
                          result[funcName].components = {
                            ...result[funcName].components,
                            ...newComponentPart,
                            ...buildCountPart,
                          };
                        }
                      }

                      // Remove the original fetchComponents reference
                      if (result[funcName]?.components?.fetchComponents) {
                        delete result[funcName].components.fetchComponents;
                      }

                      if (result?.[funcName]?.role === "config") {
                        result[funcName]["fetchDOM"] = true;
                        result[funcName]["container"] = funcName + "-component";
                      }

                      if (result && typeof result === "object") {
                        Object.assign(customFunctions, result);
                      }
                    } else {
                      console.error(
                        `Function ${funcNameConfig} not found. Check naming consistency between: globals/config.js schemaParts, Schema directory filename, and function name consistency. Expected: ${funcNameConfig}`
                      );
                    }
                  });
                }
              });
            });
          }
          partConfig.customFunctions = customFunctions;
          schema[part] = partConfig;
          resolve(schema);
        } else {
          reject(`Part ${part} not found in schemaParts.`);
        }
      });
    });

    await Promise.all(partPromises);

    ë.logSpacer("Schema build successful", "", true);
    return schema;
  },
  false
);

const vanillaConfig = ë.frozenVanilla(
  "vanillaConfig",
  function vanillaConfig(landing, passedConfig, passedVendors) {
    let htmlPath;
    let cssPath;
    let dir = passedConfig[landing].dir || `client/views/${landing}/`;
    let functionFile = passedConfig[landing].functionFile || landing;
    let seo = passedConfig[landing].seo;
    let container;
    if (
      passedConfig?.[landing]?.fetchDOM &&
      passedConfig?.[landing]?.fetchDOM === true
    ) {
      htmlPath =
        passedConfig?.[landing].htmlPath ||
        `client/views/${landing}/${landing}.html`;
      cssPath =
        passedConfig?.[landing].cssPath ||
        `client/views/${landing}/${landing}.css`;
      container = passedConfig?.[landing].container;
    }

    let prependconfig = {
      dir: dir,
      functionFile: functionFile,
      htmlPath: htmlPath,
      cssPath: cssPath,
      container: container,
    };

    ë.seo = seo;
    passedConfig[landing] = {
      ...prependconfig,
      ...passedConfig[landing],
    };

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

    ë.frozenVanilla("freezeConfig", freezeConfig, false);
    freezeConfig(passedConfig, "originBurst");

    ë.frozenVanilla("passedVendors", passedVendors, false);

    let buildConfig = {};
    //ë.passedConfig = passedConfig;
    ë.logSpacer("checking" + ë.vanillaBurstScripts());
    buildConfig[landing] = {
      landing: landing,
      scripts: [
        ...ë.vanillaBurstScripts(),
        ...Object.entries(ë.vanillaScoops)
          .filter(
            ([key, namespaces]) =>
              namespaces === true ||
              (Array.isArray(namespaces) && namespaces.includes(landing))
          )
          .map(([key]) => `${ë.fullPath}scoops/${key}/${key}.js`),
      ], // Array of required script paths
      preloader: ë.fullPath + "preloader.js", // Assuming this path is correct
      customFunctions: {
        //this is what the passedConfig is building out, which comes from schemas/ folder let's say homeConfig.js
        // example: {
        //   dir: "client/views/example/",
        //   functionFile: "example",
        //   render: "pause",
        //   originBurst: {
        //     somevalue: "", //optional custom value
        //     someobj: {}, //optional custom object
        //     somearray:[] // optional custom array
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
  },
  false
);

// [HELPER FUNCTION] buildRollCall
//custom call, depending on reload requirements, or refresh, helper function
ë.frozenVanilla(
  "buildRollCall",
  async function buildRollCall(rollCall, renderSchema, runFunction) {
    if (runFunction === "functionBurst") {
      //runFunction = ''
      runRoll = "rollBurst";
      ë.childFunction(renderSchema, rollCall, runRoll);
    }
  }
);
