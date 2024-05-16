window.frozenVanilla("storeBurst", function (vanillaPromise) {
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
          vanillaPromise.originBurst[burstSchema][vanillaPromise.this]
            .serverResult || null,
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
  const key = await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encodedData = encoder.encode(JSON.stringify(data));
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encodedData
  );
  return { key, iv, encryptedData };
}

window.frozenVanilla("myBurst", function (myPromise) {
  //myBurstObject
  // myPromise = {
  //   signal: "name of event, ie load, set, delete, etc",
  //   landing: vanillaPromise.renderSchema.landing,
  //   origin: "where you call myburst",
  //   target: "receiving function",
  //   container: "optional", //by ID currently
  //   callBack: "functionFile by name", //ie window.completeCheckout functionFile name is completeCheckout
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

  if (callBack && typeof window[callBack] === "function") {
    callBack = window[callBack];
  }

  let checkInterval = setInterval(() => {
    if (typeof window[target] === "function") {
      clearInterval(checkInterval);
      startBurst();
    } else {
      console.log("not ran yet");
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
      window.addEventListener("storage", function (event) {
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
            console.log(
              "Access denied: " + namespace + " is not a privileged namespace."
            );
            return;
          }
        }
      });
    } else if (action === "cancel") {
      // Remove the storage event listener
      window.removeEventListener("storage");
    }
  }
});
