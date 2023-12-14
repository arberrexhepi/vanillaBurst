window.genConfig = function genConfig() {
  
  let genConfig = {};

   passedConfig = {
      'gen': {
        'role':'parent',
        'dir': 'client/views/gen/',
        'functionFile': 'gen',
        'render': 'pause',
        'originBurst': 'gen',
        'htmlPath':'client/views/gen/gen.html',
        'cssPath':'client/views/gen/gen.css',
        'targetDOM':'levelbox'
      },
    }

    genConfig = {...vanillaConfig('gen', passedConfig)}

  
  return genConfig;

  };
  