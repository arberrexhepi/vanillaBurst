/**
 * Initializes the start signal with a specified action.
 *
 * @function vanillaSignal
 * @param {string} action - The action to initialize the start signal with. Can be "go", "pause", or "reset".
 * @example
 * // init, go, pause, reset
 */

ë.frozenVanilla("vanillaSignal", async function (signal) {
  let {
    vanillaPromise,
    signalName = false,
    namespace = false,
    action = "pause",
    reCall = null,
    initAction = action,
    vanillaDOM = null,
    onEvent = null,
    init = null,
    count,
    time,
    repeat = false,
    intermittent = null,
    callBack = false,
    clearable = null,
    verbose = false,
  } = signal;

  let signalStatus;
  let eventData;
  let affectAction;
  if (onEvent && Array.isArray(onEvent)) {
    let checkSignal = ë.getSignal(signalName, "_signal");

    if (checkSignal !== false) {
      if (checkSignal?.signal?.[signalName]?.action !== "remove") {
        checkSignal.signal[signalName].action =
          checkSignal?.signal?.[signalName]?.initAction;
      } else {
        checkSignal.signal[signalName].action = "remove";
      }

      localStorage.setItem(
        signalName + "_signal",
        JSON.stringify(checkSignal.signal)
      );
      action = checkSignal.signal?.[signalName]?.action;
    }

    let signalObject = {
      signalName: signalName,
      action: action,
      type: "_signal",
    };
    let remove;
    let eventResult = await ë.one(onEvent[0], onEvent[1], signalObject, true);
    affectAction = eventResult[0];
    eventData = eventResult[1];
  }

  if (onEvent !== "pause" || onEvent !== "reset" || onEvent !== "remove") {
    signalStatus = true;
  } else {
    signalStatus = false;
  }
  if (action === "reset") {
    action = initAction;
  }

  if (signalName === "timeSignal" && !time) {
    time = 100;
    count = 9999999;
    repeat = true;
  }
  if (verbose && verbose === true) {
    ë.vanillaMess("intermittent check", intermittent, "function");
  }
  if (action && action !== "remove") {
    ë.signalInterval({
      vanillaPromise,
      signalName: signalName,
      namespace,
      action: affectAction || action,
      initAction: action,
      eventData: eventData || null,
      init: (action, eventData) => {
        if (action === "go") {
          signalStatus = true;
        }

        let checkSignal = ë.getSignal(signalName, "_signal");
        let signalAtInit = checkSignal.signal;
        let storeSignalName = checkSignal.storeSignalName;

        if (signalAtInit?.[signalName]?.action) {
          action = signalAtInit?.[signalName]?.action;
        }

        if (init && typeof init === "function") {
          init("init", eventData);
        }
        return {
          action: signalAtInit?.[signalName]?.action || initAction,
          eventData: eventData,
        };
      },
      vanillaDOM,
      signalAffectDOM,
      count: count ? count : 0,
      time: time,
      repeat: repeat,
      reCall,
      intermittent: async (intermittentPack) => {
        let data = intermittentPack;
        console.log(
          "intermittentPack " + signalName + " " + JSON.stringify(data)
        );
        //return false;

        return new Promise((resolve, reject) => {
          let intermittentReturn;
          if (init && typeof intermittent === "function") {
            intermittentReturn = intermittent(data);
          }

          data.action = intermittentReturn?.action
            ? intermittentReturn.action
            : data.action;

          data.data = intermittentReturn;

          data.signalStatus = intermittentReturn?.signalStatus
            ? intermittentReturn.signalStatus
            : data.signalStatus;
          resolve(data);
        })
          .then((data) => {
            console.table(data);

            return data;
          })
          .catch((error) => {
            throw new Error(error);
          });
      },
      callBack: async (callBackData) => {
        switch (callBackData.action) {
          case "init":
            loggerFunction(callBackData.action, "init");

            return action;
            break;
          case "go":
            loggerFunction(callBackData.action, "go");

            return action;
            break;
          case "pause":
            loggerFunction(callBackData.action, "pause");

            return action;
            break;
          case "reset":
            loggerFunction(callBackData.action, "reset");
            await callBack(callBackData);
            //await ë.resetSignal(signalName, "_signal", "reset");
            if (callBackData.eventData) {
              signalAffectDOM(
                vanillaDOM,
                vanillaPromise,
                callBackData.eventData
              );
            }

            // if (
            //   reCall &&
            //   reCall !== null &&
            //   callBackData.eventData.targetId === reCall.caller
            // ) {
            //   reCall.reCallFunction(vanillaPromise);
            // }
            //ë.myweather(vanillaPromise);

            break;
          case "remove":
            loggerFunction(callBackData.action, "reset");
            await intermittent(callBackData);
            await ë.resetSignal(signalName, "_signal", "remove");
            if (callBackData.eventData) {
              signalAffectDOM(vanillaDOM, vanillaPromise);
            }

            return false;
            break;
          case "completed":
            ë.logSpacer("completed");
            loggerFunction(callBackData.action, "completed");
            await callBack(callBackData);
            if (callBackData.eventData) {
              signalAffectDOM(vanillaDOM, vanillaPromise);
            }
        }

        function loggerFunction(callBackData, expected) {
          ë.logSpacer(
            "callback params at signal SWITCH on " +
              expected +
              ": " +
              "action: " +
              callBackData.action,
            "status: " + callBackData.signalStatus,
            "counter :" + callBackData.counter,
            "intmittent value: " + callBackData.value,
            "intermittent eventData:" + callBackData.eventData || null
          );
        }
      },
      clearable: clearable,
      verbose: verbose ? verbose : false,
    });
  }
  async function signalAffectDOM(vanillaDOM, vanillaPromise, eventData) {
    if (
      !eventData ||
      (eventData & (eventData === null) && eventData?.cache !== "no-cache") ||
      !vanillaDOM ||
      !vanillaDOM?.component
    ) {
      return;
    }
    console.log(
      `logging element selector #${vanillaDOM.component}-${vanillaPromise.renderSchema.landing}_${vanillaPromise.this} ${vanillaDOM.container}`
    );
    let selector = `#${vanillaDOM.component}-${vanillaPromise.renderSchema.landing}_${vanillaPromise.this} ${vanillaDOM.container}`;
    console.log("Selector: " + signalName, selector);
    let element = document.querySelector(selector);
    console.log("Element: " + signalName, element);
    if (element) {
      let html = element.innerHTML;
      console.log("HTML:", html);

      await ë.updateComponent(
        vanillaPromise,
        {
          clear: true,
          position: 0,
          insert: "before",
          tag: "div",
          html: [html],
        },
        vanillaDOM.component,
        `${vanillaDOM.container}`
      );
    } else {
      console.log("Element not found");
    }
  }
});
