window.appRequest = async function appRequest(renderSchema, runFunction, levelsPackage) {

   levelsPackage = window.levelsPackage;
   renderSchema = window.renderSchema;
   await renderSchema;
   await runFunction
   if(runFunction){
   rollCall = [
      'app',
      ...levelsPackage
      ];

    window.rollCall = rollCall;
    window.runRoll = 'rollBurst';
    await window.childFunction(renderSchema, rollCall, runRoll);

  
   };
  
  };
  