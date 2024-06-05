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

              // Later, when creating eventData...
              let eventData = {
                type: event, // or any other event type you want
                cache: cache ? cache : "no-cache",
                targetId: element.id,
                targetClass: element.className,
                currentTargetId: element.id,
                attributes: element.attributes,
                currentTargetClass: element.classList,
                clientX: clientX,
                clientY: clientY,
              };

              alert(eventData.cache + "affectSignal");

              console.log("Event Data:", eventData);

              ë.logSpacer(`signal: ${JSON.stringify(signal)} 
                          signalName: ${signalName} 
                          storeSignalname: ${storeSignalName}
                          action: ${action}
                          storedMode" ${storedMode}
                          `);

              let currentCase;

              if (action === "go") {
                action = "pause";
                signalStatus = false;
                currentCase = action + "expecting pause";
              } else if (action === "pause") {
                action = "go";
                signalStatus = true;
                currentCase = action;
              } else if (action === "reset") {
                await ë.resetSignal(signalName, type, "reset", eventData);
                action = "reset";
                signalStatus = false;
                currentCase = action;
              } else if (action === "remove") {
                await ë.resetSignal(signalName, type, "remove", eventData);
                action = "remove";
                signalStatus = false;
                currentCase = action;
              } else {
                action = "go";
                currentCase = action + "forced go";
              }

              if (signal?.[signalName]?.action && eventData) {
                signal[signalName].action = action;
                signal[signalName].status = signalStatus;

                signal[signalName].eventData = eventData;

                if (action !== "reset" || action !== "remove") {
                  localStorage.setItem(storeSignalName, JSON.stringify(signal));
                }
                //  throw new Error("yoo");
                eventResult = [action, eventData];
                resolve(eventResult);
              } else {
                eventResult = [action, eventData];
                resolve(eventResult);
              }
            });
            break;
          default:
            console.log("Event not handled:", event);
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

ë.many = function (actions, options, useCapture) {
  if (actions) {
    actions.forEach(([selector, eventType, action, cache]) => {
      this.one(selector, eventType, { ...options, action, cache }, useCapture);
    });
  }
};
