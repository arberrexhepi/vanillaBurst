window.sharedFunction1Config = function sharedFunction1Config(burstTo) {
  
  
   let sharedFunction1Config = {
        'sharedFunction1': {
          'dir': 'client/views/app/functions/',
          'functionFile': 'sharedFunction1',
          'render': 'pause',
          'originBurst': {
              'namespace':burstTo
          }
        },
      }
  
    return sharedFunction1Config;
  
    };
    