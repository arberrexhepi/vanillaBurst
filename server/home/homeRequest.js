window.homeRequest = async function homeRequest(renderSchema, runFunction) {


  runFunction = window.runFunction;
  await runFunction;

  if (runFunction) {
    
    rollCall = [
      'home',
      'appShell'
      //...window.appviewPackage //use ... array spread for if there are actual multiple functions in the package
    ];

    await window.buildRollCall(renderSchema, rollCall, runFunction)

  }

};
