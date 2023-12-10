window.signalBurst = function signalBurst(signalObject, signalFunction, signalResult) {
    signalResult = signalResult;
    if (signalObject === undefined) {
        return;
    }
   
    if(signalResult === undefined){
      signalResult = window.originBurst?.signalBurst?.signalResult;
    }
    if(window.originBurst?.signalBurst !== undefined){
    
     
      history.state['signalBurst'] = {'origin': history.state.stateTagName, 'signal': signalObject, 'signalResult':signalResult};
      window.originBurst.signalBurst= {'origin': history.state.stateTagName, 'signal': signalObject, 'signalResult':signalResult};

    }else{
      history.state['signalBurst'] = {'origin': history.state.stateTagName, 'signal': signalObject, 'signalResult': signalResult};
      window.originBurst['signalBurst']= {'origin': history.state.stateTagName, 'signal': signalObject, 'signalResult':signalResult};
    }

    if (Array.isArray(signalFunction) && signalFunction.length > 1) {
        let promiseChain = Promise.resolve();

        signalFunction.forEach(function (element) {
            promiseChain = promiseChain.then(function () {
                if (typeof window[element] === 'function') {
                    return window[element](); // Call the function if it's indeed a function
                } else {
                    console.error('signalBurst: No such function', element);
                }
            });
        });

    } else {
        if (typeof window[signalFunction] === 'function') {
            window[signalFunction]();
        } else {
            console.error('signalBurst: No such function', signalFunction);
        }
    }
}


  window.getSignal = function getSignal(signalSend){
    if(window.originBurst?.signalBurst === undefined){
      
      signalSend = undefined;
    }else{
        signalSend = window.originBurst.signalBurst
        history.state.signalBurst=signalSend;
    }
    return signalSend;
  }