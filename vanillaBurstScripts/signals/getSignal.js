ë.frozenVanilla("getSignal", function (signalName, type, verbose) {
  let storeSignalName;
  if (type && type === "_simpleSignal") {
    storeSignalName = signalname + "_simpleSignal";
  } else if (type && type === "_signal") {
    storeSignalName = signalName + "_signal";
  }

  let signals = JSON.parse(localStorage.getItem(storeSignalName));
  if (verbose) {
    ë.logSpacer(JSON.stringify(signals));
  }
  let targetsInterval = signals?.[signalName]
    ? signals?.[signalName]
    : undefined;
  if (!targetsInterval || targetsInterval === null) {
    return false;
  } else {
    if (verbose === true) {
      ë.vanillaMess(
        "signal",
        "signalId:",
        signals[signalName].id,
        "number",
        "signal"
      );
      ë.vanillaMess(
        "signal",
        "signalName:",
        signals[signalName],
        "string",
        "signal"
      );
    }
    return { signal: signals, storeSignalName: storeSignalName };
  }
});
