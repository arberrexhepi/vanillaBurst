window.genRequest = async function genRequest(renderSchema, runFunction, levelsPackage) {
  runFunction = window.runFunction;
  await runFunction;
  if (runFunction) {
    
    rollCall = [
      ...window.appShells,

      'gen',

      //...window.appviewPackage //use ... array spread for if there are actual multiple functions in the package
    ];

    await window.buildRollCall(rollCall, renderSchema, runFunction)
    window.freezeSchema();

          }
};
