window.level1Request = async function level1Request(renderSchema, levelsPackage) {

    if(window.runFunction === "functionBurst"){
    rollCall = [
       'level1',
      // ...levelsPackage
       ];
 
       window.buildRollCall(rollCall, renderSchema, runFunction)
    }
   
   };
   