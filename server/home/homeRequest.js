window.homeRequest = async function homeRequest(renderSchema, runFunction) {

  
  runFunction = window.runFunction;
  await runFunction;
  if (runFunction) {
    
    rollCall = [
      ...window.appShells,

      'home',

      //...window.appviewPackage //use ... array spread for if there are actual multiple functions in the package
    ];

    await window.buildRollCall(rollCall, renderSchema, runFunction)
    window.freezeSchema();

          }
};
