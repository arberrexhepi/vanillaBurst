ë.frozenVanilla(
  "simpleSignal",
  async function ({
    vanillaPromise,
    namespace = true,
    signalName,
    init = null,
    count = null,
    time = 1000,
    repeat = false,
    callBack = null,
    clearable = false,
  }) {
    let counter = 0;

    let returnOnValue = false;
    if (count === null) {
      returnOnValue = true;
    }
    if (init && typeof init === "function") {
      await init();
    }
    let simpleSignal =
      JSON.parse(localStorage.getItem(signalName + "_simpleSignal")) || {};

    if (!simpleSignal[signalName + "_simpleSignal"]?.id) {
      let intervalId = setInterval(async () => {
        //console.log(vanillaPromise?.passedFunction?.originBurst?.namespace);
        //console.log(history.state.stateTagName);
        if (
          namespace === true &&
          Array.isArray(
            vanillaPromise?.passedFunction?.originBurst?.namespace
          ) &&
          vanillaPromise.passedFunction.originBurst.namespace.includes(
            history.state.stateTagName
          )
        ) {
          //console.log(vanillaPromise?.passedFunction?.originBurst?.namespace);

          counter++;
          if (typeof callBack === "function") {
            await callBack(counter);
          } else {
            ë.resetSignal(signalName, "_simpleSignal");
            alert("callback is not a function");
          }
          if (
            typeof count === "number" &&
            counter >= count &&
            returnOnValue !== true
          ) {
            if (repeat) {
              counter = 0;
            } else {
              clearInterval(intervalId);
            }
          } else if (!count) {
            if (typeof callBack === "function") {
              await callBack();
            }
            if (clearable === true) {
              ë.resetSignal(signalName, "_simpleSignal");
            }
          }
        }
      }, time);

      simpleSignal[signalName + "_simpleSignal"] = {
        id: intervalId,
        clearable: clearable,
        repeatOnCount: count,
        repeat: repeat,
        time: time,
      };
      localStorage.setItem(
        signalName + "_simpleSignal",
        JSON.stringify(simpleSignal)
      );
    } else if (clearable === true) {
      ë.resetSignal(signalName, "_simpleSignal");
    }
  }
);
