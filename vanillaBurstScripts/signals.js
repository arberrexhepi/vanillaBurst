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
  const privilegedNamespaces = myPromise.namespace;
  let signal = myPromise.signal || "load";
  let landing = myPromise.landing || null;
  let target = myPromise.target || myPromise.origin;
  let container = myPromise.container;
  let action = myPromise.action || null;
  let callBack = myPromise.callBack;
  let data = myPromise.data || null;

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

ë.frozenVanilla(
  "registerInterval",
  async function (signalName, init, count, time, repeat, callBack, clear) {
    let counter = 0;

    if (init) {
      await init();
    }
    let intervals = JSON.parse(localStorage.getItem("intervals")) || {};
    count = count ? count : 999;
    let intervalId = setInterval(async () => {
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
    }, time);

    intervals[signalName] = {
      id: intervalId,
      clear: clear,
      repeatOnCount: count,
      repeat: repeat,
      time: time,
    };
    localStorage.setItem("intervals", JSON.stringify(intervals));
  }
);

ë.frozenVanilla("unregisterInterval", function (signalName) {
  let storedIntervals = JSON.parse(localStorage.getItem("intervals"));
  if (
    storedIntervals[signalName] &&
    storedIntervals[signalName].clear === "clear"
  ) {
    clearInterval(storedIntervals[signalName].id);
  }
});

///thinking about this update where an interval controls signalBurst

// ë.registerInterval(
//   "myBurstWatcher",
//   () => {
//     // Check the condition here
//     // For example, you could check if a certain value in vanillaPromise.passedFunction has changed
//     if (vanillaPromise.passedFunction?.someValue !== previousValue) {
//       // If the condition is met, return true to start the interval
//       return true;
//     } else {
//       // If the condition is not met, return false to prevent the interval from starting
//       return false;
//     }
//   },
//   1000, // Interval duration
//   true, // Repeat
//   () => {
//     // Callback function to be executed on each interval
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
//     // This function will be executed when the interval is cleared
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
