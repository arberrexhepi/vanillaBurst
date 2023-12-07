window.level1Config = function level1Config() {
  
  let level1Config = {};

   passedConfig = {
      'level1': {
        'role':'parent',
        'dir': 'client/views/level1/',
        'functionFile': 'level1',
        'render': 'pause',
        'originBurst': 'level1'
      },
    }

    level1Config = {...vanillaConfig('level1', passedConfig)}

  
  return level1Config;

  };
  