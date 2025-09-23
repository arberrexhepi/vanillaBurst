ë.frozenVanilla("vanillaAccessor", function (vanillaPromise, signal, calling) {
  if (!signal) return null;

  // If 'calling' is an array, assume [actualCalling, callback]
  if (Array.isArray(calling)) {
    const actualCalling = calling[0];
    const externalCallback = calling[1];
    const value = ë.signalStore.get(
      signal,
      ë.vanillaAccessor,
      vanillaPromise,
      actualCalling
    );
    if (value === undefined) {
      console.debug(`Signal ${signal} not found in signalStore.`);
      return null;
    }
    // Subscribe the external callback so that it executes on subsequent updates
    if (
      typeof externalCallback === "function" &&
      typeof ë.signalStore.subscribe === "function"
    ) {
      if (ë[`${actualCalling}_subscribed`] !== true) {
        ë.signalStore.subscribe(signal, externalCallback);
        ë.frozenVanilla(`${actualCalling}_subscribed`, externalCallback, true);
        // Immediately call the callback with the current value if it exists
        if (value !== undefined) {
          externalCallback(value);
        }
      } else {
        console.debug(
          `Callback ${externalCallback} already subscribed for signal ${signal}`
        );
      }
    }
    const updateValue = function (newVal) {
      ë.signalStore.set(signal, newVal);
    };
    return [value, updateValue];
  } else {
    // Backwards compatibility for non-array "calling"
    return ë.signalStore.get(
      signal,
      ë.vanillaAccessor,
      vanillaPromise,
      calling
    );
  }
});

ë.frozenVanilla("signalRunner", function (signalPack, vanillaPromise) {
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
          ë.logSpacer("Processing signal", signal);
          const callback = groupSignals[signal];
          ë.logSpacer("Processing signal", signal, "with callback", callback);
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
});

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
