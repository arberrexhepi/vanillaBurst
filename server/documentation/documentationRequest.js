window.documentationRequest = async function documentationRequest(renderSchema, runFunction) {

  
  runFunction = window.runFunction;
  await runFunction;
  if (runFunction) {
    
    rollCall = [
      ...window.appShells,
       'documentation',

       //...window.uiPackage
       ];


       //await window.appShellReady

          await window.buildRollCall(rollCall, renderSchema, runFunction)

          window.freezeSchema();

      //  await window.appShellReady

      //  if(window.appShellReady === undefined){
      //     window.buildRollCall(rollCall, renderSchema, runFunction)

      //  }
      //  else{
      //    await window.buildRollCall(rollCall, renderSchema, runFunction)
      //    alert('yea')
      //    Object.keys(renderSchema).forEach(key => {
      //             Object.defineProperty(window, key, {
      //                 value: renderSchema[key],
      //                 writable: false,
      //                 configurable: false
      //             });
      //         });
      //         window.deepFreeze(renderSchema)
    
      //  }

 
      
    }
   
   
}