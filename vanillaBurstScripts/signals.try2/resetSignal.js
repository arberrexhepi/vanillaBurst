/**
 * Unregisters a signal.
 *
 * @function resetSignal
 * @param {string} signalName - The name of the signal to unregister.
 * @param {boolean} [remove=false] - Optional. If true, removes the signal from the stored intervals.
 */

ë.frozenVanilla(
  "resetSignal",
  function (signalName, type, affectAction, eventData) {
    // alert(affectAction);
    return new Promise((resolve, reject) => {
      let checkSignal = ë.getSignal(signalName, type);
      let storedSignal = checkSignal.signal;

      if (storedSignal?.[signalName]?.clearable === true) {
        storedSignal[signalName].counter = 0;
        storedSignal[signalName].status = false;
        storedSignal[signalName].timeElapsed = 0;
        storedSignal[signalName].startTime = Date.now();
        storedSignal[signalName].action = affectAction;
        localStorage.setItem(
          checkSignal.storeSignalName,
          JSON.stringify(storedSignal)
        );

        resolve(true);
      } else {
        reject(`Failed to unregister signal ${checkSignal.storeSignalName}.`);
      }

      reject(`Signal ${checkSignal.storeSignalName} not found.`);
    });
  }
);
