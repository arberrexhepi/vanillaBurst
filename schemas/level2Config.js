window.level2Config = function level2Config() {
  
  let level2Config = {};

   passedConfig = {
      'level2': {
        'role':'parent',
        'dir': 'client/views/level2/',
        'functionFile': 'level2',
        'render': 'pause',
        'originBurst': 'level2'
      },
    }

    level2Config = {...vanillaConfig('level2', passedConfig)}

  
  return level2Config;

  };
  