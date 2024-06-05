ë.frozenVanilla("signalInterval", async function (signalObject) {
  let {
    vanillaPromise,
    signalName = false,
    namespace = false,
    action = "pause",
    reCall,
    initAction = "pause",
    vanillaDOM = null,
    signalAffectDOM = null,
    eventData = null,
    init = null,
    count,
    time,
    repeat = false,
    intermittent = null,
    callBack = false,
    clearable = null,
    verbose = false,
  } = signalObject;
  //ë.logSpacer(signalName);
  if (signalName === false) {
    return;
  }

  action = action ? action : "go";
  let initCallAction;
  if (init) {
    initCallAction = await init(action, eventData);
  }

  let signals = JSON.parse(localStorage.getItem(signalName + "_signal")) || {};
  let counter = signals?.[signalName]?.counter
    ? signals[signalName].counter
    : 0;
  count = count ? count : 999;

  if (!signals[signalName + "_signal"]?.id) {
    ///set signal Interval
    let signalId = setInterval(async () => {
      signals = JSON.parse(localStorage.getItem(signalName + "_signal")) || {};
      let signalStatus = true;
      console.log(signals[signalName], signalName);
      if (signals?.[signalName]) {
        if (signals[signalName]?.action === "pause") {
          signals[signalName].counter = counter;
          localStorage.setItem(signalName + "_signal", JSON.stringify(signals));
        }
      }

      if (
        vanillaPromise?.passedFunction?.originBurst?.namespace.includes(
          history.state.stateTagName || signalName === "timeSignal"
        )
      ) {
        let intermittentPass;
        let callBackPack;

        if (signals?.[signalName]?.timeElapsed) {
          signals[signalName].timeElapsed =
            Date.now() - signals[signalName].startTime;
        }
        if (
          signals?.[signalName]?.action === "reset" ||
          signals?.[signalName]?.action === "remove"
        ) {
          signals[signalName].counter = 0;
          localStorage.setItem(signalName + "_signal", JSON.stringify(signals));
          //alert(signals[signalName].action);
          console.log("reset data " + JSON.stringify(signals[signalName]));
          intermittentPass = await intermittent(signals[signalName]);

          await callBack(intermittentPass);
          signalAffectDOM(vanillaDOM, vanillaPromise, intermittentPass);

          if (signals?.[signalName]?.action === "remove") {
            localStorage.removeItem(signalName + "_signal");
            clearInterval(signals[signalName]?.id);

            return false;
          }
          clearInterval(signals[signalName]?.id);
          localStorage.setItem(signalName + "_signal", JSON.stringify(signals));

          // return false;
        } else {
          if (!signals?.[signalName]?.action) {
            return;
          }
          signals[signalName].action = action;
        }

        localStorage.setItem(signalName + "_signal", JSON.stringify(signals));

        console.table(
          signals?.[signalName]?.action || initCallAction,
          signalStatus,
          counter
        );

        let data;
        let CallBackResult;
        if (typeof callBack === "function") {
          if (typeof intermittent === "function") {
            intermittentPass = await intermittent(signals[signalName]);
          }
          let checkAction = ë.getSignal(signalName, "_signal");
          if (checkAction !== false) {
            // ë.logSpacer(JSON.stringify(checkAction));
            action = checkAction.signal[signalName].action;
            //  ë.logSpacer(action);
          }
          console.table(intermittentPass);
          data = intermittentPass;

          let CallBackResult = false;
          CallBackResult = await callBack(data);

          data.action = CallBackResult?.action
            ? CallBackResult.action
            : data.action;

          data.signalStatus = CallBackResult?.signalStatus
            ? CallBackResult.signalStatus
            : data.signalStatus;
          if (data?.data) {
            data.data = CallBackResult?.data ? CallBackResult.data : data.data;
          } else if (CallBackResult?.data) {
            data.data = CallBackResult?.data ? CallBackResult.data : data.data;
          }

          // while (CallBackResult === true) {
          //   ë.logSpacer("waiting");
          // }
        }

        switch (data.action) {
          case "init":
            //alert("initting");
            counter++;
            break;
          case "go":
            if (typeof count === "number" && counter >= count) {
              ë.logSpacer("reached max count " + count);
              data.action = "completed";
              data.counter = 0;
              console.log(
                "Logging callBackPack at go max" + JSON.stringify(data)
              );

              await callBack(data);
              counter = 0;
            }

            counter++;
            signals[signalName].counter = counter;
            signals[signalName].signalStatus = true;
            signals[signalName].timeElapsed =
              Date.now() - signals[signalName].startTime;
            if (verbose && verbose === true) {
              ë.vanillaMess(
                "check callback result",
                [counter, Date.now()],
                "array"
              );
            }
            signalStatus = true;

            break;
          case "pause":
            //counter--;

            signals[signalName].signalStatus = false;
            signals[signalName].startTime = Date.now();
            //  ë.vanillaMess("check callback result", [counter, Date.now()], "array");
            signalStatus = false;
            return false;
            break;
          case "reset":
            break;
          case "completed":
        }

        ///////if max count is reached

        if (verbose && verbose === true) {
          ë.vanillaMess(
            "[signalInterval]: ",
            [signalName, intermittentPass, CallBackResult],
            "checking"
          );
        }
        localStorage.setItem(signalName + "_signal", JSON.stringify(signals));
      }
    }, time);

    ///Build localstorage for signal observing

    if (!signals?.[signalName]) {
      signals[signalName] = {
        action: action,
        initAction: initAction,
        id: signalId,
        clearable: clearable,
        count: count,
        counter: counter,
        repeatOnCount: count,
        repeat: repeat,
        time: time,
        startTime: Date.now(),
        timeElapsed: 0,
        signalStatus: null,
        eventData: eventData,
      };
    } else {
      ///////TESTING CLEAR
      if (
        signals?.[signalName]?.id &&
        signals?.[signalName]?.clear &&
        signals?.[signalName]?.clear === true
      ) {
        signals[signalName].counter = 0;
        signals[signalName].startTime = Date.now();
        signals[signalName].timeElapsed = 0;
        clearInterval(signals?.[signalName]?.id);
      }

      //////TESTING CLEAR END
    }

    localStorage.setItem(signalName + "_signal", JSON.stringify(signals));
  } else {
    //   if (clearable && typeof clearable === "function") {
    //     clear();
    //   }
  }
});
