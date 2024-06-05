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
    affectors = onEvent,
    verbose = false,
  } = signal;

  let signalStatus;
  let eventData;
  let affectAction;
  let counter = 0;

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

  if (affectors && affectors !== null) {
    ë.many(affectors, { signalName: "weatherSignal", type: "_signal" }, true);
  }

  if (onEvent !== "pause" || onEvent !== "reset" || onEvent !== "remove") {
    signalStatus = true;
  } else {
    signalStatus = false;
  }
  if (action === "reset") {
    action = initAction;
  }
  // console.log("vanillaDOM", JSON.stringify(vanillaDOM));
  // console.log("signalName:", signalName);
  // console.log("Signal:", ë.signalStore.get(signalName));
  // console.log("Function:", ë.signalStore.get(`${signalName}_runner`)[init]);
  // console.log(
  //   "Function:",
  //   ë.signalStore.get(`${signalName}_runner`)[intermittent]
  // );
  // console.log("Function:", ë.signalStore.get(`${signalName}_runner`)[callBack]);

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
        } else {
          signalStatus = false;
        }

        let checkSignal = ë.getSignal(signalName, "_signal");
        let signalAtInit = checkSignal.signal;

        if (signalAtInit?.[signalName]?.action) {
          action = signalAtInit?.[signalName]?.action;
        } else {
          action = affectAction || initAction;
        }

        if (init && typeof init === "function") {
          ë.signalStore.get(signalName)[init]("init", eventData);
        }
        return {
          action: affectAction || initAction,
          counter: counter++,
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
        loggerFunction(
          data,
          signalName + "receiving intermittent: " + intermittent
        );
        //return false;
        return new Promise(async (resolve, reject) => {
          let intermittentReturn;
          if (
            intermittent &&
            intermittent !== null &&
            typeof ë.signalStore.get(`${signalName}_runner`)[intermittent] ===
              "function"
          ) {
            intermittentReturn = await ë.signalStore
              .get(`${signalName}_runner`)
              [intermittent](data);
          } else {
            ë.vanillaMess(
              `[vanillaSignal, signalName: ${signalName}] Missing Intermittent: ${intermittent}`,
              ë.signalStore.get(`${signalName}_runner`)[intermittent],
              "array"
            );
            return;
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
            loggerFunction(
              data,
              signalName + "resolved intermittent: " + intermittent
            );
            return data;
          })
          .catch((error) => {
            ë.vanillaMess(
              `[vanillaSignal, signalName: ${signalName}] Failed Intermittent: ${intermittent}`,
              error,
              "array"
            );
          });
      },
      callBack: async (callBackData) => {
        loggerFunction(callBackData, signalName + "callBack: " + callBack);

        if (
          !callBack ||
          callBack === null ||
          typeof ë.signalStore.get(`${signalName}_runner`)[callBack] !==
            "function"
        ) {
          ë.vanillaMess(
            `[vanillaSignal, signalName: ${signalName}] Missing callBack: ${callBack}`,
            ë.signalStore.get(`${signalName}_runner`)[callBack],
            "array"
          );
          return;
        }
        switch (callBackData.action) {
          case "init":
            return action;
            break;
          case "go":
            return action;
            break;
          case "pause":
            return action;
            break;
          case "reset":
            await ë.signalStore
              .get(`${signalName}_runner`)
              [callBack](callBackData);
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
            await ë.signalStore
              .get(`${signalName}_runner`)
              [intermittent](callBackData);
            await ë.resetSignal(signalName, "_signal", "remove");
            if (callBackData.eventData) {
              signalAffectDOM(vanillaDOM, vanillaPromise);
            }

            return false;
            break;
          case "completed":
            await ë.signalStore
              .get(`${signalName}_runner`)
              [callBack](callBackData);
            if (callBackData.eventData) {
              signalAffectDOM(vanillaDOM, vanillaPromise);
            }
        }
      },
      clearable: clearable,
      verbose: verbose ? verbose : false,
    });
    function loggerFunction(data, expected) {
      if (verbose && verbose === true) {
        ë.logSpacer(
          "callback params at signal SWITCH at " +
            expected +
            ": " +
            "action: " +
            data.action,
          "status: " + data.signalStatus,
          "counter :" + data.counter,
          "intmittent value: " + data.value,
          "intermittent eventData:" + data.eventData || null
        );
      }
    }
  }
  async function signalAffectDOM(vanillaDOM, vanillaPromise, eventData) {
    try {
      if (
        !eventData ||
        (eventData & (eventData === null) && eventData?.cache !== "no-cache") ||
        !vanillaDOM ||
        !vanillaDOM?.component
      ) {
        return;
      }

      let selector = `#${vanillaDOM.component}-${vanillaPromise.renderSchema.landing}_${vanillaPromise.this} ${vanillaDOM.container}`;
      let element = document.querySelector(selector);
      if (element) {
        let html = element.innerHTML;

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
        ë.vanillaMess(
          `[vanillaSignal, signalName: ${signalName}] signalAffectDOM: Element for selector ${selector}`,
          [`selector: ${selector}`, `element: ${element}`],
          array
        );
      }
    } catch {
      ë.vanillaMess(
        `[vanillaSignal, signalName: ${signalName}] signalAffectDOM: Error !`,
        [vanillaDOM, vanillaPromise, eventData],
        array
      );
    }
  }
});
