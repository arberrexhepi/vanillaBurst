ë.frozenVanilla("signalInterval", async function (signalObject) {
  let {
    vanillaPromise,
    signalName = false,
    namespace = false,
    action = "pause",
    initAction = "pause",
    vanillaDOM = null,
    signalAffectDOM = null,
    eventData = null,
    initName = null,
    init = null,
    count,
    time,
    repeat = false,
    intermittentName = null,
    intermittent = null,
    callBackName = null,
    callBack = false,
    clearable = null,
    verbose = false,
  } = signalObject;
  if (!signalName) return;

  let initPass;
  if (init) {
    initPass = await init(action, eventData);
  }

  let signals = JSON.parse(localStorage.getItem(signalName + "_signal")) || {};
  let counter = signals?.[signalName]?.counter || initPass.counter;
  count = count || 999;
  action = action || initPass.action;

  if (!signals[signalName + "_signal"]?.id) {
    let signalId = setInterval(async () => {
      signals = JSON.parse(localStorage.getItem(signalName + "_signal")) || {};

      if (verbose) console.log(signals[signalName], signalName);

      if (
        vanillaPromise?.passedFunction?.originBurst?.namespace.includes(
          history.state.stateTagName || signalName === "timeSignal"
        )
      ) {
        let intermittentPass;

        if (signals?.[signalName]?.timeElapsed) {
          signals[signalName].timeElapsed =
            Date.now() - signals[signalName].startTime;
        }

        let data, CallBackResult;
        if (typeof callBack === "function") {
          if (typeof intermittent === "function") {
            intermittentPass = await intermittent(signals[signalName]);
          }

          data = intermittentPass;
          CallBackResult = await callBack(data);

          data.action = CallBackResult?.action || data.action;
          data.signalStatus = CallBackResult?.signalStatus || data.signalStatus;

          if (data?.data) {
            data.data = CallBackResult?.data || data.data;
          }
        }

        // Handle state changes explicitly
        switch (data.action) {
          case "go":
            if (typeof count === "number" && counter > count) {
              data.action = "completed";
              data.counter = 0;
              data.data = await callBack(data);

              // Prepare for "completed" state
              await ë.signalStore
                .get(`${signalName}_runner`)
                [callBackName](data);

              if (data.data.eventData) {
                signalAffectDOM(vanillaDOM, vanillaPromise);
              }

              counter = 0; // Reset counter to 0
              signals[signalName].action = "completed"; // Set action to completed
              signals[signalName].signalStatus = false;

              if (repeat !== false) {
                signals[signalName].action = "go"; // If repeating, stay in "go" state
                return "go";
              }
            } else {
              signals[signalName].action = "go";
              signals[signalName].signalStatus = true;
            }

            signals[signalName].counter = counter; // Continue incrementing counter
            signals[signalName].timeElapsed =
              Date.now() - signals[signalName].startTime;
            counter++;
            break;

          case "pause":
            signals[signalName].action = "pause"; // Keep it paused
            signals[signalName].signalStatus = false;
            signals[signalName].startTime = Date.now();
            counter = signals[signalName].counter;
            return;

          case "reset":
            counter = 0;
            signals[signalName].counter = 0; // Start incrementing from 0
            signals[signalName].signalStatus = true;
            signals[signalName].timeElapsed =
              Date.now() - signals[signalName].startTime;
            signals[signalName].action = "go";
            break;

          case "remove":
            alert("removing");

            await ë.resetSignal(signalName, "_signal", "remove");
            let signalRemovalCheck = await ë.resetSignal(
              signalName,
              "_signal",
              "remove"
            );

            signalAffectDOM(
              vanillaDOM,
              vanillaPromise,
              (eventData = data?.data?.eventData ? data?.data?.eventData : null)
            );

            await ë.signalStore
              .get(`${signalName}_runner`)
              [intermittentName](data);

          // return;
          case "removed":
            if (data?.data?.eventData) {
              signalAffectDOM(vanillaDOM, vanillaPromise, data.data.eventData);
            }

            await ë.signalStore
              .get(`${signalName}_runner`)
              [intermittentName](data);

            return;

          case "completed":
            // Handle the logic when the action is "completed"
            data.counter = count; // Reset counter
            signals[signalName].signalStatus = false; // Mark as not active
            await callBack(data); // Execute any callbacks for completed state

            // Optionally handle DOM updates if needed
            if (data.data.eventData) {
              signalAffectDOM(vanillaDOM, vanillaPromise, data.data.eventData);
            }

            // Reset the action if repeat is enabled
            if (repeat !== false) {
              signals[signalName].action = "go";
              signals[signalName].counter = 0; // Reset counter for the next iteration
            } else {
              signals[signalName].action = "completed"; // Maintain completed state if no repeat
            }
            break;
        }

        // Always update localStorage after making changes
        localStorage.setItem(signalName + "_signal", JSON.stringify(signals));
      }
    }, time);

    initializeSignal(signals, signalName, signalId, {
      action,
      initAction,
      clearable,
      count,
      counter,
      repeat,
      time,
      eventData,
    });
  }
});

function initializeSignal(signals, signalName, signalId, params) {
  signals[signalName] = {
    ...params,
    id: signalId,
    startTime: Date.now(),
    timeElapsed: 0,
    signalStatus: true,
  };
  localStorage.setItem(signalName + "_signal", JSON.stringify(signals));
}
