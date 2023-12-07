// appConfig.js
window.appConfig = function appConfig(sharedParts) {

    let appConfig = {};
    passedConfig = {
        //this has a request

        'nav': {
            'dir': 'client/views/app/ui/',
            'functionFile': 'nav',
            'render': 'pause',
            'originBurst': 'app'
        },
        'modals': {
            'dir': 'client/views/app/ui/',
            'functionFile': 'modals',
            'render': 'pause',
            'originBurst': 'app'
        },
        'scoreTracker': {
            'dir': 'client/views/app/score/',
            'functionFile': 'scoreTracker',
            'render': 'pause',
            'originBurst': 'app'
        },
        'app': {
            'role': 'parent',
            'dir': 'client/views/app/',
            'functionFile': 'app',
            'render': 'pause',
            'originBurst': 'app',
            'htmlPath': 'client/views/app/app.html',
            'cssPath': 'client/views/app/app.css',
        },
        ...sharedParts

    }

    appConfig = { ...vanillaConfig('app', passedConfig) }



    return appConfig;
};



