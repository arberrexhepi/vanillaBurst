function defineSignalStore() {
  if (typeof ë.signalStore === "undefined") {
    const storage = {};
    const subscribers = {}; // Added declaration for subscribers

    const signalStore = (function () {
      function set(prop, value) {
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

        // Notify any subscribers for this signal
        if (subscribers[prop]) {
          subscribers[prop].forEach((cb) => {
            if (typeof cb === "function") {
              cb(frozenValue);
            }
          });
        }

        return frozenValue;
      }

      function get(prop, caller, secret, calling) {
        // console.log("Caller:", caller);
        // console.log("Allowed Caller:", allowedCaller);
        ë.logSpacer("Secret:", secret?.secret);
        ë.logSpacer("Calling:", calling);
        //ë.logSpacer("Storage:", storage);

        // Check if the caller is allowed to access the value
        if (caller === allowedCaller) {
          const storedPromise = storage[calling];
          ë.logSpacer(
            "logging storedpromise_vanillaPromise for " +
              calling +
              " " +
              JSON.stringify(storedPromise, null, 2)
          );
          ë.logSpacer("secret check " + JSON.stringify(secret?.secret));
          if (secret?.secret) {
            secret = secret.secret;
          } else {
            function getCookie(name) {
              const value = `; ${document.cookie}`;
              const parts = value.split(`; ${name}=`);
              if (parts.length === 2) {
                return decodeURIComponent(parts.pop().split(";").shift());
              }
              return null;
            }

            secret = getCookie("secret");
            if (!secret) {
              ë.logSpacer("Secret cookie not found.");
              return null;
            }
          }
          ë.logSpacer(secret + " " + calling);

          if (storedPromise && storedPromise.secret === secret) {
            return storage[prop];
          } else {
            ë.logSpacer(
              "Mismatched secret: Unauthorized access to signalStore for " +
                prop +
                "by " +
                calling
            );
          }
        } else {
          ë.logSpacer(
            "Caller not allowed: Unauthorized access to signalStore for " +
              prop +
              "by " +
              caller
          );
        }
      }

      function subscribe(prop, callback) {
        if (!subscribers[prop]) {
          subscribers[prop] = [];
        }
        subscribers[prop].push(callback);
      }

      function unsubscribe(prop, callback) {
        if (subscribers[prop]) {
          subscribers[prop] = subscribers[prop].filter((cb) => cb !== callback);
        }
      }
      function adminGet(prop) {
        return storage[prop];
      }

      function remove(prop) {
        delete storage[prop];
      }

      // Store the allowed caller
      let allowedCaller = null;

      return {
        set,
        get,
        adminGet,
        subscribe,
        unsubscribe,
        remove,
        setAllowedCaller: function (caller) {
          allowedCaller = caller;
        },
      };
    })();

    // Attach signalStore to ë
    ë.frozenVanilla("signalStore", signalStore);
  }
}

try {
  defineSignalStore();
} catch (error) {
  ë.logSpacer(
    "Oops, looks like we've mixed up signals, we'll try preparing it again!",
    error
  );
  window.location.reload();
}

// ... rest of your signals.js code ...
ë.clearSignal = function (signal, callback) {
  let unsubscribed = false;
  let removed = false;
  let deletedSubscribedProp = false;

  // Extract callback function name if possible
  const callbackName = callback && callback.name ? callback.name : null;
  const subscribedProp = callbackName
    ? `${signal}_${callbackName}_subscribed`
    : `${signal}_subscribed`;

  // Always try to unsubscribe
  if (typeof ë.signalStore.unsubscribe === "function" && callback) {
    try {
      ë.signalStore.unsubscribe(signal, callback);
      unsubscribed = true;
      console.log(
        `[clearSignal] Unsubscribed from signal: ${signal} with callback: ${callbackName}`
      );
    } catch (e) {
      console.error(
        `[clearSignal] Failed to unsubscribe from signal: ${signal} with callback: ${callbackName}`,
        e
      );
    }
  } else if (!callback) {
    console.warn(
      `[clearSignal] No callback provided for unsubscribing from signal: ${signal}`
    );
  }

  // Always try to remove the signal
  if (typeof ë.signalStore.remove === "function") {
    try {
      ë.signalStore.remove(signal);
      removed = true;
      console.log(`[clearSignal] Removed signal: ${signal}`);
    } catch (e) {
      console.error(`[clearSignal] Failed to remove signal: ${signal}`, e);
    }
  }

  // Remove the _subscribed prop from ë if it exists (with callback name if available)
  if (Object.prototype.hasOwnProperty.call(ë, subscribedProp)) {
    try {
      delete ë[subscribedProp];
      deletedSubscribedProp = true;
      console.log(`[clearSignal] Deleted property: ${subscribedProp} from ë`);
    } catch (e) {
      // fallback for non-configurable properties
      ë[subscribedProp] = undefined;
      console.warn(
        `[clearSignal] Could not delete property: ${subscribedProp} from ë, set to undefined instead.`,
        e
      );
    }
  }

  if (!unsubscribed && !removed && !deletedSubscribedProp) {
    console.warn(`[clearSignal] No actions performed for signal: ${signal}`);
  }
};

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
      ë.logSpacer("Failed to parse signalBurst from localStorage:", e);
      signalBurst = {};
    }

    try {
      originBurst =
        JSON.parse(localStorage.getItem("originBurst")) ||
        vanillaPromise.originBurst;
    } catch (e) {
      ë.logSpacer("Failed to parse originBurst from localStorage:", e);
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

function defineIntervalStore() {
  if (typeof window.intervalStore === "undefined") {
    const storage = {};

    Object.defineProperty(window, "intervalStore", {
      value: function intervalStore(prop, value, setAsWindowProp = true) {
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
    window.intervalStore.get = function (prop) {
      return storage[prop];
    };

    // Add a method to set values in the storage
    window.intervalStore.set = function (prop, value) {
      const frozenValue =
        typeof value === "function"
          ? Object.freeze(value.bind(this))
          : Object.freeze(value);
      storage[prop] = frozenValue;
      return frozenValue;
    };

    window.intervalStore.remove = function (prop) {
      delete storage[prop];
    };
  }
  ë.frozenVanilla("intervalStore", intervalStore);
}

try {
  defineIntervalStore();
} catch (error) {
  console.error(
    "Oops, looks like we've mixed up signals, we'll try preparing it again!",
    error
  );
  window.location.reload();
}
