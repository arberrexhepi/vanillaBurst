/**
 * Unregisters a signal.
 * Because this can take affectAction, this function could evolve into a count setter for step reruns, etc.
 * @function resetSignal
 * @param {string} signalName - The name of the signal to unregister.
 * @param {boolean} [remove=false] - Optional. If true, removes the signal from the stored intervals.
 */

ë.frozenVanilla(
  "resetSignal",
  async function (signalName, type, affectAction, eventData) {
    return new Promise(async (resolve, reject) => {
      let checkSignal = ë.getSignal(signalName, type);
      let storedSignal = checkSignal.signal;

      if (
        storedSignal?.[signalName]?.removed &&
        storedSignal?.[signalName]?.removed === true
      ) {
        // If signal is already marked as removed, resolve immediately
        resolve(null);
        return;
      }

      if (storedSignal?.[signalName]?.clearable === true) {
        alert("removing");
        // Reset the signal data
        storedSignal[signalName].counter = 0;
        storedSignal[signalName].status = false;
        storedSignal[signalName].timeElapsed = 0;
        storedSignal[signalName].startTime = Date.now();
        if (affectAction === "remove") {
          affectAction = "removed";
        }
        storedSignal[signalName].action = affectAction;

        if (affectAction === "remove") {
          storedSignal[signalName]["removed"] = true;
        }

        // Update localStorage with the modified signal data
        localStorage.setItem(
          checkSignal.storeSignalName,
          JSON.stringify(storedSignal)
        );

        // Resolve with the full updated storedSignal
        resolve(storedSignal);
      } else {
        reject(`Failed to unset signal ${checkSignal.storeSignalName}.`);
        return; // Ensure we exit after rejecting
      }

      // If no conditions are met, reject with not found
      reject(`Signal ${checkSignal.storeSignalName} not found.`);
    });
  }
);
