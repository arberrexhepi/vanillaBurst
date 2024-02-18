// appConfig.js
window.appShellConfig = function appShellConfig(burstTo) {

 

    let appShellConfig = {
   
        'appShell': {
            'dir': 'client/views/appShell/',
            'functionFile': 'appShell',
            'render': 'pause',
            'originBurst': {
                'namespace':burstTo
            },
            'footer':{
                'button':{
                'htmlDir':'client/components/footer/footer.html',
                'cssDir':'client/components/footer/footer.css',
                'htmlTarget':'footer',
                'id':'footer',
                'class':'footer'
              },
            }
        }
   
        }

    return appShellConfig;
};
