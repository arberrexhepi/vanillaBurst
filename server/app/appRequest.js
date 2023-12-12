window.appRequest = async function appRequest(renderSchema, runFunction) {


  runFunction = window.runFunction;
  await runFunction;

  if (runFunction) {
    
    rollCall = [
      'app',
      ...window.appviewPackage //use ... array spread for if there are actual multiple functions in the package
    ];

    await window.buildRollCall(renderSchema, rollCall, runFunction)

  }

};
