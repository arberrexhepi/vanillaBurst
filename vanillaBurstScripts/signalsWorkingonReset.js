ë.frozenVanilla("storeBurst", function (vanillaPromise) {
  let key = Object.values(vanillaPromise.originBurst)[0];

  let signalBurst, originBurst;

  try {
    signalBurst = JSON.parse(localStorage.getItem("signalBurst"));
  } catch (e) {
    console.error("Failed to parse signalBurst from localStorage:", e);
    signalBurst = {};
  }

  try {
    originBurst =
      JSON.parse(localStorage.getItem("originBurst")) ||
      vanillaPromise.originBurst;
  } catch (e) {
    console.error("Failed to parse originBurst from localStorage:", e);
    originBurst = {};
  }

  let burstSchema = vanillaPromise.renderSchema.landing;

  for (let [key, value] of Object.entries(vanillaPromise.originBurst)) {
    // Check if signalBurst[burstSchema] exists, if not initialize it to an empty object
    if (!signalBurst) {
      signalBurst = {};
    }
    if (!signalBurst?.[burstSchema]) {
      signalBurst[burstSchema] = {};
    }

    // Merge the new data with the existing data
    signalBurst[burstSchema] = {
      ...signalBurst?.[burstSchema],
      [vanillaPromise.this]: {
        signal: "load",
        landing: vanillaPromise.renderSchema.landing || null,
        origin: vanillaPromise.this || null,
        target: vanillaPromise.this || null,
        container: null,
        callBack: null,
        action: null,
        namespace:
          [vanillaPromise.renderSchema.landing, vanillaPromise.this] || null,
        signalResult:
          vanillaPromise?.originBurst?.[burstSchema]?.[vanillaPromise.this]
            ?.serverResult || null,
      },
    };

    // Merge the new data with the existing data
    for (let [key, value] of Object.entries(vanillaPromise.originBurst)) {
      // Check if originBurst[key] exists, if not initialize it to an empty object
      if (!originBurst.hasOwnProperty(key)) {
        originBurst[key] = {};
      }
      //Merge the new data with the existing data
      originBurst[key] = {
        ...originBurst[key],
        ...value,
      };
    }
  }

  localStorage.setItem("signalBurst", JSON.stringify(signalBurst));
  // encryptData(signalBurst).then((encryptedSignalBurst) => {
  //   localStorage.setItem("signalBurst", JSON.stringify(encryptedSignalBurst));
  // });
  localStorage.setItem("originBurst", JSON.stringify(originBurst));

  // encryptData(originBurst).then((encryptedOriginBurst) => {
  //   localStorage.setItem("originBurst", JSON.stringify(encryptedOriginBurst));
  // });
});

async function encryptData(data) {
  const encoder = new TextEncoder();
  const key = await ë.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
  const iv = ë.crypto.getRandomValues(new Uint8Array(12));
  const encodedData = encoder.encode(JSON.stringify(data));
  const encryptedData = await ë.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encodedData
  );
  return { key, iv, encryptedData };
}

ë.frozenVanilla("myBurst", function (myPromise) {
  //myBurstObject
  // myPromise = {
  //   signal: "name of event, ie load, set, delete, etc",
  //   landing: vanillaPromise.renderSchema.landing,
  //   origin: "where you call myburst",
  //   target: "receiving function",
  //   container: "optional", //by ID currently
  //   callBack: "functionFile by name", //ie ë.completeCheckout functionFile name is completeCheckout
  //   action: "set, watch, cancel",
  //   namespace: ["namespace1", "namespace2", "namespace3"],
  //   data: "data to pass", //optional
  // };

  // List of privileged namespaces
  let {
    vanillaPromise,
    action = "go",
    event = "load",
    count = 1,
    time,
    repeat = false,
    origin = vanillaPromise.renderSchema.landing,
    container = undefined,
    intermittent = null,
    callBack,
    data = null,
    cache = false,
    namespace = vanillaPromise.passedFunciton.namespace,
  } = myPromise;
  if (callBack && typeof ë[callBack] === "function") {
    callBack = ë[callBack];
  }

  let checkInterval = setInterval(() => {
    if (typeof ë[target] === "function") {
      clearInterval(checkInterval);
      startBurst();
    } else {
      ë.logSpacer(
        `myBurst() from ${myPromise.origin} for target ${myPromise.target} has not ran yet`
      );
    }
  }, 500); // Check every 1000 milliseconds (1 second)

  // Check if the provided namespace is privileged
  function startBurst() {
    let signalBurst = JSON.parse(localStorage.getItem("signalBurst")) || {};
    let signalBurstPack = signalBurst[landing][target] || {};
    if (action === "get") {
      if (typeof callBack === "function") {
        callBack(signalBurstPack);
      }
      return signalBurstPack;
    }

    if (action === "set") {
      signalBurstPack = {
        signal: signal,
        landing: landing,
        origin: target,
        target: target,
        container: container,
        callBack: callBack,
        action: action,
        namespace: privilegedNamespaces,
        signalResult: data,
      };

      let originBurstPack =
        JSON.parse(localStorage.getItem("originBurst")) || {};
      if (container) {
        if (!originBurstPack?.[landing]?.[target].htmlResult) {
          originBurstPack[landing][target]["htmlResult"] = data;
        }
        originBurstPack[landing][target].htmlResult = data;
      }

      // Now, set this to the signalBurst in localStorage
      signalBurst[landing][target] = signalBurstPack;
      localStorage.setItem("signalBurst", JSON.stringify(signalBurst));
      if (typeof callBack === "function") {
        callBack();
      }
    } else if (action === "watch") {
      ë.addEventListener("storage", function (event) {
        if (event.key === "signalBurst") {
          if (!privilegedNamespaces.includes(namespace)) {
            signalBurstPack = {
              signal: signal,
              landing: landing,
              origin: target,
              target: target,
              container: container,
              callBack: callBack,
              action: action,
              namespace: privilegedNamespaces,
              signalResult: data,
            };
            ë.logSpacer(
              "Access denied: " + namespace + " is not a privileged namespace."
            );
            return;
          }
        }
      });
    } else if (action === "cancel") {
      // Remove the storage event listener
      ë.removeEventListener("storage");
    }
  }
});

ë.frozenVanilla("getSignal", function (signalName, type, verbose) {
  let storeSignalName;
  if (type && type === "_simpleSignal") {
    storeSignalName = signalname + "_simpleSignal";
  } else if (type && type === "_signal") {
    storeSignalName = signalName + "_signal";
  }

  let signals = JSON.parse(localStorage.getItem(storeSignalName));
  console.log(JSON.stringify(signals));
  let targetsInterval = signals?.[signalName]
    ? signals?.[signalName]
    : undefined;
  if (!targetsInterval || targetsInterval === null) {
    return false;
  } else {
    if (verbose === true) {
      ë.vanillaMess("signalId:", signals[signalName].id, "number");
      ë.vanillaMess("signalName:", signals[signalName], "string");
    }
    return { signal: signals, storeSignalName: storeSignalName };
  }
});

/**
 * Registers a new signal.
 *
 * @function signalInterval
 * @param {string} signalName - The name of the signal.
 * @param {function} initExecutionFunction - A function that is executed at the initialization of the signal.
 * @param {number} count - The number of times the signal should be emitted.
 * @param {number} time - The interval between signal emissions in milliseconds.
 * @param {boolean} repeat - Whether the signal should repeat.
 * @param {function} intermittentFunction - A function that communicates between `initExecutionFunction` and `callBackFunction`.
 * @param {function} callBackFunction - A function that is called each time the signal is emitted.
 * @param {boolean} [clear=false] - Optional. Instructs to clear the interval at count end. Use actions for immediate interventions.
 *
 * ë.signalInterval(
 *   "signalName",
 *   initExecutionFunction,
 *   count,
 *   time,
 *   repeat,
 *   intermittentFunction,
 *   callBackFunction,
 *   clear
 * );
 */

ë.frozenVanilla("signalInterval", async function (signalObject) {
  let {
    vanillaPromise,
    signalName = false,
    namespace = false,
    action = "pause",
    initAction = "pause",
    init = null,
    count,
    time,
    repeat = false,
    intermittent = null,
    callBack = false,
    clearable = null,
    verbose = false,
  } = signalObject;
  //alert(signalName);

  if (signalName === false) {
    return;
  }

  action = action ? action : "go";
  let initValue;
  if (init) {
    initValue = await init(action);
  }
  action = initValue;

  let signals = JSON.parse(localStorage.getItem(signalName + "_signal")) || {};
  let counter = signals?.[signalName]?.counter
    ? signals[signalName].counter
    : 0;
  count = count ? count : 999;

  if (!signals[signalName + "_signal"]?.id) {
    ///set signal Interval
    let signalId = setInterval(async () => {
      if (signals?.[signalName]) {
        if (signals[signalName]?.action === "pause") {
          signals[signalName].counter = counter;
          localStorage.setItem(signalName + "_signal", JSON.stringify(signals));

          return;
        }
      }

      if (
        vanillaPromise?.passedFunction?.originBurst?.namespace.includes(
          history.state.stateTagName || signalName === "timeSignal"
        )
      ) {
        let intermittentPass;
        let intermittentCounter = counter;
        if (signals?.[signalName]?.timeElapsed) {
          signals[signalName].timeElapsed =
            Date.now() - signals[signalName].startTime;
        }
        let CallBackResult;
        if (typeof callBack === "function") {
          if (typeof intermittent === "function") {
            intermittentPass = intermittent(
              initValue,
              "running",
              intermittentCounter
            );
          }
          let checkAction = ë.getSignal(signalName, "_signal");
          if (checkAction !== false) {
            // alert(JSON.stringify(checkAction));
            action = checkAction.signal[signalName].action;
            //  alert(action);
          }
          CallBackResult = await callBack(
            (intermittentPass.action = action),
            "running",
            (intermittentPass.value = null)
          );
        }

        switch (CallBackResult) {
          case "init":

          case "go":
            counter++;
            signals[signalName].counter = counter;
            signals[signalName].status = "running";
            signals[signalName].timeElapsed =
              Date.now() - signals[signalName].startTime;
            if (verbose && verbose === true) {
              ë.vanillaMess(
                "check callback result",
                [counter, Date.now()],
                "array"
              );
            }

            break;
          case "pause":
            //counter--;

            signals[signalName].status = "paused";
            signals[signalName].startTime = Date.now();
            //  ë.vanillaMess("check callback result", [counter, Date.now()], "array");
            return false;
            break;
          case "reset":
            //counter--;
            // signals[signalName].counter = 0;
            // signals[signalName].status = "init";
            // signals[signalName].startTime = Date.now();
            // signals[signalName].timeElapsed = 0;
            clearInterval(signalId[(signalName, "_signal")]);
            await ë.resetSignal(signalName, "_signal", true);

            //  ë.vanillaMess("check callback result", [counter, Date.now()], "array");
            return false;
            break;
          case "completed":
        }

        ///////if max count is reached
        if (typeof count === "number" && counter >= count) {
          counter = 0;
          if (repeat) {
            if (intermittent && typeof intermittent === "function") {
              intermittentPass = intermittent("complete", "completed");

              await callBack("complete", "completed", true);
            } else {
              await callBack(
                "complete",
                counter,
                (intermittentPass.value = true)
              );
            }
          } else {
            clearInterval(signalId[signalName]);
          }
        } else if (!count) {
          if (typeof callBack === "function") {
            action = "completed";
            intermittentPass = intermittent(action, counter);

            await callBack(intermittent);
          }
          clearInterval(signalId[signalName]);
        }
        if (verbose && verbose === true) {
          ë.vanillaMess(
            "[signalInterval]: ",
            [signalName, intermittentPass, CallBackResult],
            "checking"
          );
        }
        localStorage.setItem(signalName + "_signal", JSON.stringify(signals));
      }
    }, time);

    ///Build localstorage for signal observing

    if (!signals?.[signalName]) {
      signals[signalName] = {
        action: action,
        initAction: initAction,
        id: signalId,
        clearable: clearable,
        count: count,
        counter: counter,
        repeatOnCount: count,
        repeat: repeat,
        time: time,
        startTime: Date.now(),
        timeElapsed: 0,
      };
    } else {
      ///////TESTING CLEAR
      if (
        signals?.[signalName]?.id &&
        signals?.[signalName]?.clear &&
        signals?.[signalName]?.clear === true
      ) {
        signals[signalName].counter = 0;
        signals[signalName].startTime = Date.now();
        signals[signalName].timeElapsed = 0;
        clearInterval(signals?.[signalName]?.id);
      }

      //////TESTING CLEAR END
    }

    localStorage.setItem(signalName + "_signal", JSON.stringify(signals));
  } else {
    //   if (clearable && typeof clearable === "function") {
    //     clear();
    //   }
  }
});

/**
 * Initializes the start signal with a specified action.
 *
 * @function initStartSignal
 * @param {string} action - The action to initialize the start signal with. Can be "go", "pause", or "reset".
 * @example
 * // To start the signal
 * ë.initStartSignal("go");
 * // To pause the signal
 * ë.initStartSignal("pause");
 * // To reset the signal
 * ë.initStartSignal("reset");
 */

ë.frozenVanilla("vanillaSignal", async function (signal) {
  let {
    vanillaPromise,
    signalName = false,
    namespace = false,
    action = "pause",
    initAction = action,
    onEvent = null,
    init = null,
    count,
    time,
    repeat = false,
    intermittent = null,
    callBack = false,
    clearable = null,
    verbose = false,
  } = signal;

  let eventData;
  if (onEvent && Array.isArray(onEvent)) {
    let checkSignal = ë.getSignal(signalName, "_signal");

    if (checkSignal !== false) {
      checkSignal.signal[signalName].action =
        checkSignal?.signal?.[signalName]?.initAction;
      localStorage.setItem(
        signalName + "_signal",
        JSON.stringify(checkSignal.signal)
      );
      action = checkSignal.signal?.[signalName]?.initAction;
    }

    let signalObject = {
      signalName: signalName,
      action: action,
      type: "_signal",
    };
    let eventResult = await ë.one(onEvent[0], onEvent[1], signalObject, true);
    action = eventResult[0];
    eventData = eventResult[1];
  }

  if (signalName === "timeSignal" && !time) {
    time = 100;
    count = 9999999;
    repeat = true;
  }
  if (verbose && verbose === true) {
    ë.vanillaMess("intermittent check", intermittent, "function");
  }
  if (action) {
    ë.signalInterval({
      vanillaPromise,
      signalName: signalName,
      namespace,
      action: action,
      initAction: initAction,
      init: (action) => {
        if (init && typeof init === "function") {
          init("running", eventData);
        }
        return action;
      },
      count: count ? count : 0,
      time: time,
      repeat: repeat,
      intermittent: (action, intermittentStatus, intermittentCounter) => {
        let intermittentValue;
        if (verbose && verbose === true) {
          ë.vanillaMess(
            "[vanillaSignal]: intermittent",
            intermittent,
            "function"
          );
        }
        if (action === "reset") {
          return false;
        } else {
          if (intermittentStatus === "running") {
            intermittentCounter++;
          } else if (intermittentStatus === "completed") {
            intermittentCounter = 0;
          }

          if (init && typeof intermittent === "function") {
            intermittentValue = intermittent(
              intermittentStatus,
              intermittentCounter
            );
          }
          return {
            action: action,
            intermittent: intermittent,
            value: intermittentValue,
          };
        }
      },
      callBack: async (action, status, value) => {
        // alert("callback");

        if (value === false) {
          action = "reset";
        }

        switch (action) {
          case "init":
            break;
          case "go":
            return action;
            break;
          case "pause":
            return action;
            break;
          case "reset":
            await ë.resetSignal(signalName, "_signal", true);
            return false;
            break;
          case "complete":
            await callBack(value);
        }
      },
      clearable: clearable,
      verbose: verbose ? verbose : false,
    });
  }
});

ë.frozenVanilla(
  "simpleSignal",
  async function (
    vanillaPromise,
    namespace,
    signalName,
    init,
    count,
    time,
    repeat,
    callBack,
    clearable
  ) {
    let counter = 0;

    if (init) {
      await init();
    }
    let simpleSignal =
      JSON.parse(localStorage.getItem(signalName + "_simpleSignal")) || {};
    count = count ? count : 999;
    if (!simpleSignal[signalName + "_simpleSignal"]?.id) {
      let intervalId = setInterval(async () => {
        if (
          (
            namespace &&
            namespace === true &&
            vanillaPromise?.passedFunction?.originBurst?.namespace
          ).includes(history.state.stateTagName)
        ) {
          counter++;
          if (typeof callBack === "function") {
            await callBack(counter);
          }
          if (typeof count === "number" && counter >= count) {
            if (repeat) {
              counter = 0;
            } else {
              clearInterval(intervalId);
            }
          } else if (!count) {
            if (typeof callBack === "function") {
              await callBack();
            }
            clearInterval(intervalId);
          }
        }
      }, time);

      simpleSignal[signalName + "_simpleSignal"] = {
        id: intervalId,
        clearable: clearable,
        repeatOnCount: count,
        repeat: repeat,
        time: time,
      };
      localStorage.setItem(
        signalName + "_simpleSignal",
        JSON.stringify(simpleSignal)
      );
    } else if (clearable && typeof clearable === "boolean") {
      ë.resetSignal(signalName, "_simpleSignal");
    }
  }
);
/**
 * Unregisters a signal.
 *
 * @function resetSignal
 * @param {string} signalName - The name of the signal to unregister.
 * @param {boolean} [remove=false] - Optional. If true, removes the signal from the stored intervals.
 */

ë.frozenVanilla("resetSignal", function (signalName, type, remove) {
  return new Promise((resolve, reject) => {
    let checkSignal = ë.getSignal(signalName, type);
    let storedSignal = checkSignal.signal;
    alert(JSON.stringify(storedSignal));

    if (storedSignal?.[signalName]?.clearable === true) {
      // alert(storedIntervals[name].id);
      clearInterval(storedSignal[signalName]?.id);
      alert(remove);
      if (remove && remove === true) {
        localStorage.removeItem(checkSignal.storeSignalName);
      }
      resolve(
        `Signal ${checkSignal.storeSignalName} unregistered successfully.`
      );
    } else {
      reject(`Failed to unregister signal ${checkSignal.storeSignalName}.`);
    }

    reject(`Signal ${checkSignal.storeSignalName} not found.`);
  });
});

///thinking about this update where an signal controls signalBurst

// ë.signalInterval(
//   "myBurstWatcher",
//   () => {
//     // Check the condition here
//     // For example, you could check if a certain value in vanillaPromise.passedFunction has changed
//     if (vanillaPromise.passedFunction?.someValue !== previousValue) {
//       // If the condition is met, return true to start the signal
//       return true;
//     } else {
//       // If the condition is not met, return false to prevent the signal from starting
//       return false;
//     }
//   },
//   1000, // Interval duration
//   true, // Repeat
//   () => {
//     // Callback function to be executed on each signal
//     // This is where you would put the logic for your background process
//     // For example, you could call myBurst with an action to clear the cache
//     ë.myBurst({
//       signal: "clearCache",
//       landing: vanillaPromise.renderSchema.landing,
//       origin: "myBurstWatcher",
//       target: "signalBurst",
//       action: "clear",
//     });
//   },
//   "clear",
//   () => {
//     // This function will be executed when the signal is cleared
//   }
// );

//simplify the call lower level
// ë.clearBurst = function(landing, origin, target, action) {
//   ë.myBurst({
//     signal: "clearCache",
//     landing: landing,
//     origin: origin,
//     target: target,
//     action: action,
//   });
// };

///simplify the call option 2 -- simplifying even further for lowest level, active coding use
// ë.clearBurst(vanillaPromise.renderSchema.landing, 'myBurstWatcher', 'signalBurst', 'clear');
