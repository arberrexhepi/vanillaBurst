//// One signal affect at a time
// ë.one(
//   "#pause-weather-signal",
//   "click",
//   { signalName: "weather-timer", type: "_signal", action: "pause" },
//   true
// );
// see ë.many() at the bottom of the document

ë.frozenVanilla("one", async function (target, event, signalObject, run) {
  if (run === true) {
    return new Promise(async (resolve, reject) => {
      let eventResult;

      // Check if the target element exists
      let element = document.querySelector(target);

      if (!element) {
        console.error(`No element found with the selector: ${target}`);
        return;
      }
      if (element && element !== null) {
        switch (event) {
          case "click":
            element.addEventListener("click", async function (e) {
              let clientX, clientY;
              e.stopImmediatePropagation();

              // Listen for mousemove events
              document.addEventListener("mousemove", function (e) {
                // Update clientX and clientY with the mouse's current position
                clientX = e.clientX;
                clientY = e.clientY;
              });

              let signalStatus;
              let {
                signal,
                type,
                cache,
                signalName,
                storeSignalName,
                action,
                storedMode,
              } = affectSignal(signalObject);

              // will have to get some of this data from attributes
              let eventData = {
                type: event, // or any other event type you want
                cache: cache ? cache : "no-cache",
                targetId: element.id,
                targetClass: element.className,
                currentTargetId: element.id,
                attributes: element.attributes,
                currentTargetClass: element.classList,
                clientX: clientX, //fix missing data
                clientY: clientY, //fix missing data
              };

              let currentSignalData =
                localStorage.getItem(storeSignalName) || {};

              if (currentSignalData) {
                if (typeof currentSignalData !== "object") {
                  currentSignalData = JSON.parse(currentSignalData)[signalName];
                }
              } else {
                currentSignalData["action"] = "go";
              }
              ë.logSpacer("Event Data:", eventData);

              ë.logSpacer(`signal: ${JSON.stringify(signal)} 
                          signalName: ${signalName} 
                          storeSignalname: ${storeSignalName}
                          action: ${action}
                          storedMode: ${storedMode}
                          cached: ${eventData.cache}
                          `);

              let currentCase;

              if (action === "go") {
                action = "go";
                signalStatus = true;
                if (
                  signal?.[signalName]?.counter &&
                  signal?.[signalName]?.counter !== 0
                ) {
                  signal[signalName].counter = signal[signalName].counter - 1;
                }
                currentCase = action;
              } else if (action === "pause") {
                action = "pause";
                signalStatus = false;
                currentCase = action;
              } else if (action === "reset") {
                action = "reset";
                signalStatus = true;
                currentCase = action;
              } else if (action === "remove") {
                await ë.resetSignal(signalName, type, "removed", eventData);
                action = "remove";
                signalStatus = true;
                currentCase = action;
              } else {
                action = "go";
                currentCase = action;
              }

              if (signal?.[signalName]?.action && eventData) {
                signal[signalName].action = currentCase;
                signal[signalName].status = signalStatus;

                signal[signalName].eventData = eventData;

                localStorage.setItem(storeSignalName, JSON.stringify(signal));

                //  throw new Error("yoo");
                eventResult = [currentCase, eventData];
                resolve(eventResult);
              } else {
                eventResult = [currentCase || "go", eventData];
                resolve(eventResult);
              }
            });
            break;
          default:
            ë.logSpacer("Event not handled:", event);
            return false;
        }
      }
    });

    function affectSignal(signalObject) {
      let { signalName, action, type, cache } = signalObject;
      let signalCheck = ë.getSignal(signalName, type);
      let signal = signalCheck?.signal ? signalCheck.signal : null;
      let storeSignalName = signalCheck.storeSignalName;
      let storedMode;
      if (signal?.[signalName]) {
        storedMode = true;
      }

      return {
        signal,
        type,
        signalName,
        storeSignalName,
        action,
        storedMode,
      };
    }
  }
});

ë.frozenVanilla("many", async function (actions, options, useCapture) {
  return new Promise(async (resolve, reject) => {
    if (actions) {
      actions.forEach(async ([selector, eventType, action, cache]) => {
        let theReturn = await this.one(
          selector,
          eventType,
          { ...options, action, cache },
          useCapture
        );
        //alert(JSON.stringify(theReturn));
        resolve(theReturn);
      });
    }
  });
});
