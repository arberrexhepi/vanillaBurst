 window.appRequest = async function appRequest(renderSchema, sharedFunction1Package, runFunction) {
  runFunction = window.runFunction;
  renderSchema = window.renderSchema
  await runFunction;
  if(runFunction){
   rollCall = [

      'app',
      //window.sharedFunction1Package[0],

      'sharedFunction1'
      ];
      window.buildRollCall(renderSchema, rollCall, runFunction)
      //await window.sharedFunction1;

    }
  
  };
