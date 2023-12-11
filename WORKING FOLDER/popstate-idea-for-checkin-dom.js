window.renderSchema = renderSchema

async function promiseA(renderSchema){
    await window.render(window.renderSchema);
    renderComplete = "true";
    await window[window.renderSchema.landing];

    window.renderComplete = renderComplete;
    
    if(window.originBurst && window.originBurst?.signalBurst === undefined){
      window.originBurst['signalBurst'] = {'origin': history.state.stateTagName, 'signal': 'load', 'signalResult':undefined};
    }
}
function promiseB(renderSchema){   
  therequest = (history.state.stateTagName)+'Request';
    //
    window.buildRollCall(renderSchema, rollCall, runFunction);
}

Promise.all([promiseA(renderSchema), promiseB(renderSchema)]).then(()=>{
  window[therequest](renderSchema);

  window.checkDOM(renderSchema)
})