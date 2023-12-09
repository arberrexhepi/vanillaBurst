// appConfig.js
window.appConfig = function appConfig(sharedParts) {

    let appConfig = {};


    //TODO, see bottom of document for thoughts on this
    let seo ={};

    let plugins = {};

        //this seo would be set in every view to control non body html
        seo = {
            'title':'Home - Puzzle Quest',
            'meta-description':'Time to play a game like no other!',
    
        }
    
        //including these in the main app Config could prove ideal because the app is always called.
        plugins = {
            'gtag':{
                'pluginPath':'url', 
                'executables':[], 
            },
            'animate.js':{
                'namespace': ['level1', 'level2'], 
                'dir':'' 
            }
        };

    //END TODO


    passedConfig = {
   
        'app': {
            'role': 'parent',
            'dir': 'client/views/app/',
            'functionFile': 'app',
            'render': 'pause',
            'originBurst': 'app',
            'htmlPath': 'client/views/app/app.html',
            'cssPath': 'client/views/app/app.css',
            'targetDOM':'vanillaBurst',
            'seo': seo,
        },
        ...sharedParts,
        ...plugins

    }



    appConfig = { ...vanillaConfig('app', passedConfig) }

    return appConfig;
};


///
//including these in the main app Config could prove ideal because the app is always called.
// plugins = {
//     'gtag':{
//         //'customFunctions': null] //unsetting or setting it to null means full app scope
//         'pluginPath':'url', //could be selfhosted in a vendor directory, see next example for self hosting (pluginPaths, would run a slightly off branch logic during childFunction, TODO)
//         'executables':[], //an array of functions you could run when this plugin runs, great for sending conversion signals for example, how awesome would that be?
//     },
//     'animate.js':{
//         'namespace': ['level1', 'level2'], //to load only when 
//         'dir':'' //if self hosted having this set will use vanillaBurst methods to load this in
//     }
// };


