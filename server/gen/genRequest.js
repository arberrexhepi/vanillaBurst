window.genRequest = async function genRequest(renderSchema, runFunction, levelsPackage) {
    runFunction = window.runFunction;
  await runFunction;

  if (runFunction) {

    rollCall = [
      
       'gen',
       'appShell',
      // ...levelsPackage
       ];

       //await window.appShellReady


       window.buildRollCall(rollCall, renderSchema, runFunction)
       }else{
        console.log("genRequest didn't run")
       }
 
   
   };
   