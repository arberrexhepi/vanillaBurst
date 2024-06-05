ë.frozenVanilla(
  "simpleSignal",
  async function (
    vanillaPromise,
    namespace,
    signalName,
    init,
    count,
    time,
    repeat,
    callBack,
    clearable
  ) {
    let counter = 0;

    if (init) {
      await init();
    }
    let simpleSignal =
      JSON.parse(localStorage.getItem(signalName + "_simpleSignal")) || {};
    count = count ? count : 999;
    if (!simpleSignal[signalName + "_simpleSignal"]?.id) {
      let intervalId = setInterval(async () => {
        if (
          (
            namespace &&
            namespace === true &&
            vanillaPromise?.passedFunction?.originBurst?.namespace
          ).includes(history.state.stateTagName)
        ) {
          counter++;
          if (typeof callBack === "function") {
            await callBack(counter);
          }
          if (typeof count === "number" && counter >= count) {
            if (repeat) {
              counter = 0;
            } else {
              clearInterval(intervalId);
            }
          } else if (!count) {
            if (typeof callBack === "function") {
              await callBack();
            }
            clearInterval(intervalId);
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
    } else if (clearable && typeof clearable === "boolean") {
      ë.resetSignal(signalName, "_simpleSignal");
    }
  }
);
