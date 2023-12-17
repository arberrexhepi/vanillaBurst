// appConfig.js
window.appShellConfig = function appShellConfig(burstTo) {

 

    let appShellConfig = {
   
        'appShell': {
            'dir': 'client/views/appShell/',
            'functionFile': 'appShell',
            'render': 'pause',
            'htmlPath': 'client/views/app/appShell.html',
            'cssPath': 'client/views/app/appShell.css',
            'targetDOM':'appContainer',
            'originBurst': {
                'namespace':burstTo
            },
        }
   
        }

    return appShellConfig;
};
