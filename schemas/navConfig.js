// appConfig.js
window.navConfig = function navConfig(burstTo) {

 

    let navConfig = {
   
        'nav': {
            'dir': 'client/components/nav/',
            'functionFile': 'nav',
            'render': 'pause',
            'htmlPath': 'client/components/nav/nav.html',
            'cssPath': 'client/components/nav/nav.css',
            'targetDOM':'mainNav',
            'originBurst': {
                'namespace':burstTo
            },
        }
   
        }

    return navConfig;
};
