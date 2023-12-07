window.appConfig = function appConfig(sharedParts) {
  
    let appConfig = {
      'landing': 'home',
      'scripts': window.vanillaBurstScripts,
      'preloader': window.baseUrl + 'preloader.js',
      'customFunctions': {
        'appRequest': {
          'role': 'rollCall',
          'dir': 'server/api/app/',
          'functionFile': 'appRequest',
          'render': 'burst',
          'originBurst': 'app',
          
        },
        ...sharedParts,
        'app': {
          'role': 'parent',
          'dir': 'client/views/app/',
          'functionFile': 'app',
          'render': 'pause',
          'originBurst': 'app',
          'htmlPath': 'client/views/app/html/app.html',
          'cssPath': 'client/views/app/css/app.css',
          
        },
      }
    };
    return appConfig;
  };
  