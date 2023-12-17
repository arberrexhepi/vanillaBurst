window.documentationRequest = async function documentationRequest(renderSchema, runFunction) {
   runFunction = window.runFunction;
  await runFunction;

  if (runFunction) {
    
    rollCall = [
       'documentation',
       'appShell'
       //...window.uiPackage
       ];

     
       window.buildRollCall(rollCall, renderSchema, runFunction)
      
    }
   
   
}