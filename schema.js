
window.vanillaConfig = function vanillaConfig(landing, passedConfig) {
  let landingRequest = landing + 'Request';
  let buildConfig = {};
  buildConfig[landing] = {
      'landing': landing,
      'scripts': window.vanillaBurstScripts, // Array of required script paths
      'preloader': window.baseUrl + 'preloader.js', // Assuming this path is correct
      'customFunctions': {
          [landingRequest]: {
              'role': 'rollCall',
              'dir': 'server/'+landing+'/',
              'functionFile': landingRequest,
              'render': 'burst',
              'originBurst': landing
          },
          ...passedConfig
      }
  };
  //alert(JSON.stringify(buildConfig[landing]));
  return buildConfig[landing];
};


window.buildRollCall = async function buildRollCall(rollCall, renderSchema, runFunction){
levelsPackage = window.levelsPackage;
renderSchema = window.renderSchema;
await renderSchema;
await runFunction
if(runFunction){
  rollCall = window.rollCall;
 window.rollCall = rollCall;
 window.runRoll = 'rollBurst';
 await window.childFunction(renderSchema, rollCall, runRoll);

  }

}


window.config = function config() {
  let schema = {};
  console.log("Starting window.config execution.");

  for (let part in window.schemaParts) {
    if (window.schemaParts.hasOwnProperty(part)) {
      console.log("Processing part:", part);

      let packageNames = window.schemaParts[part];

      // Skip if packageNames is false
      if (packageNames === false) {
        console.log("Skipping schema build for part:", part);
        continue;
      }

      let partResults = {};
      if (Array.isArray(packageNames)) {
        packageNames.forEach(packageName => {
          // Split packageName if it contains comma-separated values
          let individualPackageNames = packageName.includes(',') ? packageName.split(',').map(name => name.trim()) : [packageName];
      
          individualPackageNames.forEach(individualPackageName => {
            let functionNames = window[individualPackageName];
            if (Array.isArray(functionNames)) {
              functionNames.forEach(funcName => {
                let funcNameConfig = funcName+'Config';
                if (typeof window[funcNameConfig] === 'function') {
                  console.log("Executing function:", funcNameConfig);
                  let result = window[funcNameConfig](part);
                  if (result && typeof result === 'object') {
                    // Merge the function result into the partResults object
                    Object.assign(partResults, result);
                  }
                } else {
                  console.error("Function not found:", funcNameConfig);
                }
              });
            } else {
              console.error("Package not found or is not an array:", individualPackageName);
            }
          });
        });
      }
      

      console.log("Function results for", part, ":", partResults);

      // Call the part's config function with the merged results
      let configFunctionName = `${part}Config`;
      if (typeof window[configFunctionName] === 'function') {
        schema[part] = window[configFunctionName](partResults) || undefined;
      } else {
        schema[part] = undefined;
      }
    }
  }

  console.log("Completed window.config execution. Final schema:", schema);
  return schema;
};









