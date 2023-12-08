// appConfig.js
window.appConfig = function appConfig(sharedParts) {

    let appConfig = {};
    passedConfig = {
   
        'app': {
            'role': 'parent',
            'dir': 'client/views/app/',
            'functionFile': 'app',
            'render': 'pause',
            'originBurst': 'app',
            'htmlPath': 'client/views/app/app.html',
            'cssPath': 'client/views/app/app.css',
            'targetDOM':'vanillaBurst'
        },
        ...sharedParts

    }

    appConfig = { ...vanillaConfig('app', passedConfig) }



    return appConfig;
};



