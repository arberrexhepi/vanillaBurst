window.frozenVanilla(
  "childFunction",
  function (renderSchema, rollCall, runRoll, originBurst) {
    if (runRoll === true && window.ranScripts === true) {
      let runFunction;
      rollCall;

      if (Array.isArray(rollCall) && rollCall.length > 1) {
        arrayRoll(rollCall);
      } else {
        processFunction(passedFunction, functionName);
      }

      function arrayRoll(rollCall) {
        let promiseChain = rollCall.reduce((prevPromise, element) => {
          let passedFunction = renderSchema.customFunctions[element];

          let functionName = passedFunction.functionFile;

          // (JSON.stringify(passedFunction));
          let data;
          if (passedFunction && passedFunction.dataSchema) {
            data = passedFunction.dataSchema;
            let runData = "serverBurst";
            processFunction(passedFunction, functionName, data, runData);
          }
          return prevPromise
            .then(() => {
              if (passedFunction && !passedFunction.dataSchema) {
                processFunction(passedFunction, functionName);
              }
            })
            .catch((error) => {
              console.error(element, error);
            });
        }, Promise.resolve());
      }

      function processFunction(passedFunction, functionName, data, runData) {
        console.info({
          Status: "STARTING rollCall for customFunction ",
          functionName,
          passedFunction,
        });
        console.table(passedFunction);
        if (passedFunction) {
          //passedFunction.render = "burst";
          originBurst = window.updateOriginBurst(
            renderSchema,
            functionName,
            passedFunction,
            originBurst
          );

          if (passedFunction.dataSchema && passedFunction.role === "parent") {
            data = passedFunction.dataSchema;

            buildview(
              renderSchema,
              functionName,
              passedFunction,
              runFunction,
              data,
              runData
            );
          } else {
            buildview(renderSchema, functionName, passedFunction, runFunction);
          }
        }
      }

      function renderFunction(
        renderSchema,
        functionName,
        passedFunction,
        runFunction,
        originBurst,
        serverResult
      ) {
        handleRole(
          passedFunction,
          renderSchema,
          serverResult,
          originBurst,
          functionName
        );
      }
      function handleRole(
        passedFunction,
        renderSchema,
        serverResult,
        originBurst,
        functionName
      ) {
        try {
          if (passedFunction.role === "parent") {
            passedFunction.render = "burst";
            singlePromise(
              renderSchema,
              serverResult,
              passedFunction,
              originBurst
            );
          } else {
            console.info({
              Status: "Promising non parent role function ",
              functionName,
              passedFunction,
            });
            passedFunction.render = "burst";
            singlePromise(
              renderSchema,
              serverResult,
              passedFunction,
              originBurst
            );
          }
        } catch (error) {
          console.error("An error occurred:", error);
        }
      }

      // Assuming renderSchema, passedFunction, originBurst, and fullServerResult are defined and accessible in this scope

      async function serverCall(data, runData) {
        return await window.serverRender(data, runData);
      }

      async function buildview(
        renderSchema,
        functionName,
        passedFunction,
        runFunction,
        data,
        runData
      ) {
        let serverResult;
        let originBurst = window.updateOriginBurst(
          renderSchema,
          functionName,
          passedFunction
        );
        if (data && data.auto === true && runData === "serverBurst") {
          let fullServerResult;
          try {
            fullServerResult = await serverCall(data, runData);
          } catch (error) {}

          serverResult = fullServerResult[`${functionName}`];
          // ("new data for" + functionName +JSON.stringify(serverResult));

          async function runfullServerResult(serverResult) {
            console.log("after serverCall for" + functionName);
            resultTarget = functionName + "Result";
            console.log(serverResult);

            originBurst = window.setOriginBurst(
              renderSchema,
              functionName,
              passedFunction,
              originBurst,
              serverResult
            );
            renderFunction(
              renderSchema,
              functionName,
              passedFunction,
              runFunction,
              originBurst,
              serverResult
            );
            console.table({
              serverCall: "Responded",
              Results: serverResult,
            });
          }
          runfullServerResult(fullServerResult);
        } else {
          //("no data")
          console.log("no data, at buildView for" + functionName);
          renderFunction(
            renderSchema,
            functionName,
            passedFunction,
            runFunction,
            originBurst
          );
        }
      }

      //////////////////////////ORIGIN BURST

      ////Rerun a view or a chain of functions from the available namespace scope

      /////client logic
      //buildData function
      //REPETITIVE
      //USAGE: window.getData('viewName', buildView) where viewName is the customFunction of a landing is requested, where buildView is a function you want to execute from the window.viewName function
      // window.getData = async function (
      //   vanillaPromise,
      //   customFunctionName,
      //   cached,
      //   callback,
      //   renderSchema,
      //   serverResult,
      //   signalBurst
      // ) {
      //   let originBurst = vanillaPromise.originBurst;
      //   console.log(customFunctionName + "is the view name");
      //   let landingKey = renderSchema && renderSchema.landing;

      //   if (
      //     originBurst?.[renderSchema.landing]?.[customFunctionName]
      //       ?.serverResult === undefined &&
      //     cached === false
      //   ) {
      //     // Fetch new data since there's no cached data or it's been cleared

      //     // let resultData = window.fullServerResult[`${viewName}Result`];
      //     let resultData = serverResult;
      //     //console.log(resultData + "at get data");

      //     if (landingKey) {
      //       if (!originBurst[landingKey]) {
      //         originBurst[landingKey] = {};
      //       }
      //       originBurst[customFunctionName]["serverResult"] =
      //         resultData;
      //     } else {
      //       originBurst[customFunctionName]["serverResult"] = resultData;
      //     }
      //     //console.log(resultData)
      //     //     ('ran server data from getData');
      //     //callback(resultData);
      //     //return resultData;
      //   } else {
      //     // Use cached data
      //     let resultData =
      //       originBurst[landingKey][customFunctionName].serverResult || null;
      //     console.log(resultData);
      //     // ('ran originburst data from getData');
      //     //return resultData;
      //     if (resultData) {
      //       callback(resultData);
      //     } else {
      //
      //
      //
      //
      //       console.warn(
      //         "You expected data for " +
      //           customFunctionName +
      //           "but none was returned"
      //       );
      //
      //
      //
      //
      //     }
      //   }
      // };
    }
  }
);

window.frozenVanilla("reRollFunctions", function (rollCall) {
  function runReRoll(functionName) {
    if (typeof window[functionName] === "function") {
      window[functionName]();
    }
  }

  if (Array.isArray(rollCall) && rollCall.length > 1) {
    // Assuming window.rollCall is an array of function names references
    for (const functionName of rollCall) {
      runReRoll(functionName);
    }
  } else {
    // Assuming window.rollCall is a single function references by name
    runReRoll(functionName);
  }
});
