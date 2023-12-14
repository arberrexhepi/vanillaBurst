window.documentationConfig = function documentationConfig() {
  
  let documentationConfig = {};

   passedConfig = {
      'documentation': {
        'role':'parent',
        'dir': 'client/views/documentation/',
        'functionFile': 'documentation',
        'render': 'pause',
        'originBurst': 'documentation',
        'htmlPath': 'client/views/documentation/documentation.html',
        'cssPath': 'client/views/documentation/documentation.css',
        'targetDOM':'levelbox',
   
      },
    }

    documentationConfig = {...vanillaConfig('documentation', passedConfig)}


  
  return documentationConfig;

  };
  