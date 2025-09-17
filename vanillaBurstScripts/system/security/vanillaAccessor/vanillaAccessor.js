ë.frozenVanilla("vanillaAccessor", function (vanillaPromise, signal, calling) {
  if (!signal) return null;

  // If 'calling' is an array, assume [actualCalling, callback]
  if (Array.isArray(calling)) {
    const actualCalling = calling[0];
    const externalCallback = calling[1];

    // Check or store in cache
    async function checkBrowserCache(initialValue) {
      try {
        if (!("caches" in window)) {
          console.warn("Cache Storage API is not supported here.");
          return initialValue;
        }
        const cacheName = "vanillaAccessorCache";
        const cacheKey = "/vanillaAccessor/allSignals";
        const cache = await caches.open(cacheName);
        let dataObj = {};

        // Try reading existing data
        const response = await cache.match(cacheKey);
        if (response) {
          try {
            dataObj = await response.json();
          } catch (e) {
            console.warn("Failed to parse existing cached data:", e);
          }
        }

        // Update or add the signal value
        dataObj[signal] = initialValue;

        // Write back to the cache
        await cache.put(
          cacheKey,
          new Response(JSON.stringify(dataObj), {
            headers: { "Content-Type": "application/json" },
          })
        );

        // Return just this signal's data
        return dataObj[signal];
      } catch (error) {
        console.error("Error checking browser cache:", error);
        return initialValue;
      }
    }

    const value = ë.signalStore.get(
      signal,
      ë.vanillaAccessor,
      vanillaPromise,
      actualCalling
    );
    const valuePromise = checkBrowserCache(value);

    // Subscribe the external callback so that it executes on subsequent updates
    if (
      typeof externalCallback === "function" &&
      typeof ë.signalStore.subscribe === "function"
    ) {
      if (ë[`${actualCalling}_subscribed`] !== true) {
        ë.signalStore.subscribe(signal, externalCallback);
        ë.frozenVanilla(`${actualCalling}_subscribed`, externalCallback, true);
      } else {
        console.debug(
          `Callback ${externalCallback} already subscribed for signal ${signal}`
        );
      }
    }
  } else {
    async function setBrowserCache(newVal) {
      try {
        if (!("caches" in window)) return;
        const cacheName = "vanillaAccessorCache";
        const cacheKey = "/vanillaAccessor/allSignals";
        const cache = await caches.open(cacheName);
        let dataObj = {};

        // Try reading existing data
        const response = await cache.match(cacheKey);
        if (response) {
          try {
            dataObj = await response.json();
          } catch (e) {
            console.warn("Failed to parse existing cached data:", e);
          }
        }

        // Update or add the signal value, then put it back
        dataObj[signal] = newVal;
        await cache.put(
          cacheKey,
          new Response(JSON.stringify(dataObj), {
            headers: { "Content-Type": "application/json" },
          })
        );
      } catch (error) {
        console.error("Error setting browser cache:", error);
      }
    }
    // Backwards compatibility for non-array "calling"
    const storeValue = ë.signalStore.get(
      signal,
      ë.vanillaAccessor,
      vanillaPromise,
      calling
    );
    setBrowserCache(storeValue);
    return ë.signalStore.get(
      signal,
      ë.vanillaAccessor,
      vanillaPromise,
      calling
    );
  }
});

ë.signalRunner = function (signalPack, vanillaPromise) {
  console.debug("signalRunner called", { signalPack, vanillaPromise });
  if (!signalPack) {
    console.debug("No signalPack provided.");
    return;
  }

  const results = {};

  // Support the original structure with a "calling" property...
  if (signalPack.calling && typeof signalPack.calling === "object") {
    for (const signal in signalPack.calling) {
      if (signalPack.calling.hasOwnProperty(signal)) {
        const callback = signalPack.calling[signal];
        console.debug("Processing signal", signal);
        results[signal] = ë.vanillaAccessor(vanillaPromise, signal, [
          signal,
          callback,
        ]);
        console.debug("Result for signal", signal, results[signal]);
      }
    }
  } else {
    // Otherwise, assume a nested structure with groups (e.g. imageUIComponent)
    Object.keys(signalPack).forEach((group) => {
      const groupSignals = signalPack[group];
      if (groupSignals && typeof groupSignals === "object") {
        Object.keys(groupSignals).forEach((signal) => {
          console.log("Processing signal", signal);
          const callback = groupSignals[signal];
          console.log("Processing signal", signal, "with callback", callback);
          console.debug("Processing group", group, "signal", signal);
          // Here we use the signal name from the nested object.
          const key = `${group}`;
          //alert(key);
          ë.vanillaAccessor(vanillaPromise, signal, [key, callback]);
        });
      }
    });
  }

  return results;
};

//example usage
//set initial signal
// const signalMessage = "hello from imageUI.js";
// ë.signalStore.set("helloMessage", signalMessage); //signalname, value
// const signalPack = {
//   logoFunc: { //where the signal was originally set ie if working in logoFunc.js and setting signalname latestImageGeneration
//     latestImageGeneration: updateButtons,
//     stream_logoResult: updateLogoStatus,
//   },
//   imageUI: {
//     helloMessage: (message) => {
//       alert(message);
//     },
//   },
// };
