// homeConfig.js
window.homeConfig = function homeConfig(sharedParts) {

    let homeConfig = {};


    //TODO, see bottom of document for thoughts on this
    let seo ={};

    let plugins = {};

        //this seo would be set in every view to control non body html
        seo = {
            'title':'Home - Puzzle Quest',
            'meta-description':'Time to play a game like no other!',
    
        }
    
        //including these in the main home Config could prove ideal because the home is always called.
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
   
        'home': {
            'role': 'parent',
            'dir': 'client/views/home/',
            'functionFile': 'home',
            'render': 'render',
            'originBurst': 'home',
            'htmlPath': 'client/views/home/home.html',
            'cssPath': 'client/views/home/home.css',
            'targetDOM':'viewbox',
            'seo': seo,
            'subDOM':{
                'button':{
                'htmlDir':'client/components/buttons/docbutton.html',
                'cssDir':'client/components/buttons/buttons.css',
                'htmlTarget':'button-wrapper',
                'id':'docbutton',
                'class':'button round'
              },

              }
            //            //window.componentDOM('client/components/buttons/docbutton.html', 'client/components/buttons/buttons.css', 'button-wrapper', 'docbutton')

        },
        ...sharedParts,
        ...plugins

    }



    homeConfig = { ...vanillaConfig('home', passedConfig) }

    return homeConfig;
};


///
//including these in the main home Config could prove ideal because the home is always called.
// plugins = {
//     'gtag':{
//         //'customFunctions': null] //unsetting or setting it to null means full home scope
//         'pluginPath':'url', //could be selfhosted in a vendor directory, see next example for self hosting (pluginPaths, would run a slightly off branch logic during childFunction, TODO)
//         'executables':[], //an array of functions you could run when this plugin runs, great for sending conversion signals for example, how awesome would that be?
//     },
//     'animate.js':{
//         'namespace': ['level1', 'level2'], //to load only when 
//         'dir':'' //if self hosted having this set will use vanillaBurst methods to load this in
//     }
// };


