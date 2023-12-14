window.genRequest = async function genRequest(renderSchema, runFunction, levelsPackage) {
    runFunction = window.runFunction;
  await runFunction;

  if (runFunction) {

    rollCall = [
      
       'gen',
      // ...levelsPackage
       ];
 
       window.buildRollCall(rollCall, renderSchema, runFunction)
    }
 
   
   };
   