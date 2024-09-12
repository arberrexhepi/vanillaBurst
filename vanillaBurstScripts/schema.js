const config = ë.frozenVanilla(
  "config",
  async function () {
    let schema = {};
    let schemaParts = ë.frozenVanilla.get("schemaParts");
    // Log the original schemaParts object
    //alert(JSON.stringify(schemaParts));

    // Check if any key contains a "/"
    if (Object.keys(schemaParts).some((key) => key.includes("/"))) {
      // Create a new object without keys that contain a "/"
      schemaParts = Object.keys(schemaParts)
        .filter((key) => !key.includes("/"))
        .reduce((acc, key) => {
          acc[key] = schemaParts[key];
          return acc;
        }, {});
    }

    // Log the modified schemaParts object
    //alert(JSON.stringify(schemaParts));

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

          let seo = customFunctions[part].seo;
          if (!ë.seo) {
            ë.seo = {};
          }

          ë.seo[part] = { ...ë.seo[part], ...seo };

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
            const packagePromises = packageNames.map(async (packageName) => {
              let individualPackageNames = packageName.includes(",")
                ? packageName.split(",").map((name) => name.trim())
                : [packageName];

              await Promise.all(
                individualPackageNames.map(async (individualPackageName) => {
                  let functionNames = ë[individualPackageName];
                  if (Array.isArray(functionNames)) {
                    await Promise.all(
                      functionNames.map(async (funcName) => {
                        let funcNameConfig = `${funcName}Config`;
                        let result;
                        if (typeof ë[funcNameConfig] !== "function") {
                          console.log(
                            `Function ${funcNameConfig} not found, make sure this is indeed a config-less component. Check naming consistency between: globals/config.js schemaParts, Schema directory filename, and function name consistency. Expected: ${funcNameConfig}`
                          );
                          result = {
                            [partConfig.landing]:
                              partConfig.customFunctions[partConfig.landing],
                          };
                          funcName = partConfig.landing;
                        } else {
                          // alert("else");
                          result = await ë[funcNameConfig](part);
                          // alert(JSON.stringify(result));
                        }
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
                          } else if (
                            role === "component" ||
                            role === "config"
                          ) {
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
                          // alert("fetchDOM" + funcName);
                          result[funcName].functionFile =
                            result[funcName].functionFile || funcName;
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

                            // Ensure the script is loaded completely before proceeding
                            await ë.loadScript(
                              `${ë.fullPath}client/components/${dir}/${fileId}Component.js`
                            );

                            // Wait until the function is defined
                            let retries = 10;
                            while (!ë[`${fileId}Component`] && retries > 0) {
                              await new Promise((resolve) =>
                                setTimeout(resolve, 100)
                              );
                              retries--;
                            }

                            if (!ë[`${fileId}Component`]) {
                              throw new Error(
                                `Failed to load component function for ${fileId}`
                              );
                            }

                            let newComponentPart;
                            let counter = -1;
                            let buildCountPart = {};

                            // Check if 'data' is defined and is an array
                            if (data && Array.isArray(data)) {
                              await Promise.all(
                                data.map(async (item, index) => {
                                  let componentKey = `${componentId}${
                                    index + 1
                                  }`; // Create a unique key for each component
                                  item["id"] = componentKey;
                                  let thisSubId = fileId;
                                  //alert("calling " + thisSubId);
                                  let thispart = await ë[`${fileId}Component`](
                                    item ? item : null
                                  );

                                  console.log(
                                    "component result" +
                                      JSON.stringify(thispart)
                                  );

                                  // Ensure thispart[componentKey] is always an object
                                  if (
                                    !thispart[componentKey] ||
                                    typeof thispart[componentKey] !== "object"
                                  ) {
                                    thispart[componentKey] = {};
                                  }
                                  // alert(
                                  //   componentKey +
                                  //     `${ë.fullPath}client/components/${dir}/`
                                  // );

                                  thispart[componentKey] = {
                                    ...thispart[componentKey],
                                    id: item.id,
                                    componentName: fileId,
                                    refresh: item.refresh //ADD THIS LOCAL AND GIT VANILLABURST DIR
                                      ? item.refresh
                                      : false,
                                    path: `${ë.fullPath}client/components/${dir}/`,
                                    container:
                                      thispart[componentKey].container ||
                                      `${fileId}-component`,
                                    dir: thispart[componentKey].dir || fileId,
                                    ...(thispart[componentKey] || {}),
                                  };

                                  //alert(JSON.stringify(thispart));

                                  buildCountPart = {
                                    ...buildCountPart,
                                    [componentKey]: thispart[componentKey],
                                  };
                                })
                              );
                            } else if (data) {
                              // If 'data' is defined but not an array
                              if (componentId) {
                                data["id"] = componentId;
                              }
                              newComponentPart = await ë[`${fileId}Component`](
                                data
                              );
                              processNewComponentPart();
                            } else {
                              // Edge case: No data provided, retrieve the component directly
                              newComponentPart = await ë[
                                `${fileId}Component`
                              ]();

                              console.log(
                                "component result" +
                                  JSON.stringify(newComponentPart)
                              );

                              if (!newComponentPart[fileId]?.id) {
                                newComponentPart[fileId]["id"] = fileId;
                                newComponentPart[fileId]["count"] = 1;
                                newComponentPart[fileId]["dir"] = fileId;
                              }
                            }

                            function processNewComponentPart() {
                              if (!newComponentPart[subId]) {
                                newComponentPart[subId] = {};
                              }
                              newComponentPart[subId]["dir"] =
                                newComponentPart[subId]["dir"] || dir;
                              let count = data?.count ? 2 : 1;
                              newComponentPart[subId].count =
                                newComponentPart[subId].count || count;
                              newComponentPart[subId].componentName =
                                newComponentPart[subId].componentName || subId;
                              newComponentPart[subId].componentName =
                                newComponentPart[subId].path ||
                                `${ë.fullPath}client/components/${dir}/`;
                            }

                            // Ensure all merged parts are objects
                            result[funcName].components = {
                              ...result[funcName].components,
                              ...(typeof newComponentPart === "object"
                                ? newComponentPart
                                : {}),
                              ...(typeof buildCountPart === "object"
                                ? buildCountPart
                                : {}),
                            };
                          }
                        }

                        if (result[funcName]?.components?.fetchComponents) {
                          delete result[funcName].components.fetchComponents;
                        }

                        if (result?.[funcName]?.role === "config") {
                          result[funcName]["fetchDOM"] = true;
                          result[funcName]["container"] =
                            funcName + "-component";
                        }

                        if (result && typeof result === "object") {
                          Object.assign(customFunctions, result);
                        }
                      })
                    );
                  }
                })
              );
            });
            await Promise.all(packagePromises);
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
      //alert(JSON.stringify(passedConfig?.[landing]) + "is requesting DOM");
      htmlPath = passedConfig?.[landing]?.htmlPath
        ? passedConfig[landing].htmlPath
        : `client/views/${landing}/${landing}.html`;
      cssPath = passedConfig?.[landing]?.cssPath
        ? passedConfig[landing].cssPath
        : `client/views/${landing}/${landing}.css`;
      container = passedConfig?.[landing].container;
    }

    let prependconfig = {
      dir: dir,
      functionFile: functionFile,
      htmlPath: htmlPath,
      cssPath: cssPath,
      container: container,
    };

    //ë.seo = seo;
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
