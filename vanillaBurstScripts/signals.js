function defineSignalStore() {
  if (typeof window.signalStore === "undefined") {
    const storage = {};

    Object.defineProperty(window, "signalStore", {
      value: function signalStore(prop, value, setAsWindowProp = true) {
        const frozenValue =
          typeof value === "function"
            ? Object.freeze(value.bind(this))
            : Object.freeze(value);

        // If the value is an object, add get and set methods to it
        if (typeof frozenValue === "object" && frozenValue !== null) {
          frozenValue.get = function (name) {
            return this[name];
          };
          frozenValue.set = function (name, func) {
            this[name] = func;
          };
        }

        // Store the frozen value
        storage[prop] = frozenValue;

        if (
          setAsWindowProp &&
          (typeof window[prop] === "undefined" ||
            Object.getOwnPropertyDescriptor(window, prop).writable)
        ) {
          Object.defineProperty(window, prop, {
            value: frozenValue,
            writable: false,
            configurable: false,
          });
        }
        return frozenValue;
      },
      writable: false,
      configurable: false,
    });

    // Add a method to get values from the storage
    window.signalStore.get = function (prop) {
      return storage[prop];
    };

    // Add a method to set values in the storage
    window.signalStore.set = function (prop, value) {
      const frozenValue =
        typeof value === "function"
          ? Object.freeze(value.bind(this))
          : Object.freeze(value);
      storage[prop] = frozenValue;
      return frozenValue;
    };

    window.signalStore.remove = function (prop) {
      delete storage[prop];
    };
  }
}

try {
  defineSignalStore();
} catch (error) {
  console.error(
    "Oops, looks like we've mixed up signals, we'll try preparing it again!",
    error
  );
  window.location.reload();
}

ë.frozenVanilla("tsunami", function (namespace, functionName) {
  if (Array.isArray(functionName)) {
    return functionName.reduce((acc, name) => {
      acc[name] = this.signalStore.get(namespace)[name];
      return acc;
    }, {});
  } else {
    return this.signalStore.get(namespace)[functionName];
  }
}); //WIP

ë.frozenVanilla("storeBurst", function (vanillaPromise, signalObject) {
  return new Promise((resolve, reject) => {
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
          verbose: vanillaPromise.passedFunction?.signal?.verbose || false,
          name: vanillaPromise.passedFunction?.signal?.name || null,
          namespace: vanillaPromise.passedFunction?.signal?.namespace || null,
          signalStore:
            vanillaPromise.passedFunction?.signal?.signalStore || null,
          action: vanillaPromise.passedFunction?.signal?.action || null,
          onEvent: vanillaPromise.passedFunction?.signal?.onEvent,
          count: vanillaPromise.passedFunction?.signal?.count || null,
          time: vanillaPromise.passedFunction?.signal?.time || null,
          repeat: vanillaPromise.passedFunction?.signal?.repeat || null,
          init: vanillaPromise.passedFunction?.signal?.init,
          intermittent: vanillaPromise.passedFunction?.signal?.intermittent,
          callBack: vanillaPromise.passedFunction?.signal?.callBack,
          landing: vanillaPromise.renderSchema.landing || null,
          caller: signalObject?.caller || null,
          target: vanillaPromise.this || null,
          container: vanillaPromise.passedFunction.container || null,
          affectors: vanillaPromise.passedFunction?.signal?.affectors || null,
          data:
            signalObject?.data ||
            vanillaPromise.passedFunction?.signal?.data ||
            null,
          vanillaDOM: vanillaPromise.passedFunction?.signal?.vanillaDOM || null,
          clearable: vanillaPromise.passedFunction?.signal?.clearable || false,
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
    if (signalBurst && signalBurst !== null) {
      resolve(signalBurst);
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
