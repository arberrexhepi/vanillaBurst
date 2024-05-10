////SIGNAL BURST UPDATES

window.frozenVanilla("signalBurstDOM", function (originFunction, functionFile) {
  // Get signalResult and container from signalBurst
  let signalBurst = JSON.parse(localStorage.getItem("signalBurst")) || {};
  let signalResult =
    signalBurst?.[originFunction]?.[functionFile]?.signalResult;
  if (signalResult && signalResult !== null && signalResult) {
    signalResult = DOMPurify.sanitize(signalResult);
  }

  let container = signalBurst?.[originFunction]?.[functionFile]?.container;
  // Check if signalResult and container are set
  if (
    signalResult !== undefined &&
    signalResult !== null &&
    container !== undefined
  ) {
    // Get the target element by ID
    let targetElement = document.getElementById(container);

    // If the target element exists, update its content with signalResult
    if (targetElement) {
      targetElement.innerHTML = signalResult;
    }

    return true;
  } else {
    return false;
  }
});
