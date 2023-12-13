# vanillaBurstGame

This document serves as a guide for development and should be referred to often to maintain alignment with the game's vision.

vanillaBurst

vanillaBurst is a vanilla js development tool requiring only the basic tools to run JS, HTML and CSS. It builds your website/wepapp based on declared schema, auto load balancing your view landings, then extends your schema and pretty much all of it's capabilities to the developer,

At view completion the app extends these capabilities:
schema, renderSchema, viewConfig, routeCall, stateDefine, buildRollCall, serverRender, originBurst, getData, miniDOM, vanillaGo, signalBurst, getSignal, reRollFunctions

example file structure

vanillaBurst_TREEBLOCK_RULE[client]

This is a typical folder structure for a vanillBurst web application, or even if it is being used as a plugin to an existing solution
in the app you'll want to have your state views defined in client>views>someview path
you can create additional folder structures since you set the dir as you wish within the view and function Configs.
see the example for an empty component folder

vanillaBurstGame
|-- client
    |-- components //you can place certain functionalities here, as where they are placed doesn't dictate where they are available, that is done via schemaParts in config.js
    |-- views
        |-- app
            |-- functions
                |-- sharedFunction1.js
                |-- sharedFunction2.js
            |-- ui
                |-- nav.js
                |-- modals.js
            |-- score
                |-- scoreTracker.js
            |-- app.js
            |-- app.html
            |-- app.css
        |-- level1
            |-- level1.js
            |-- level1.html
            |-- level1.css
        |-- level2
            |-- level2.js
            |-- level2.html
            |-- level2.css
        |-- dbConnect //sub requests need to be built the same a view function, though they could be in any directory, here I have it in views, although it could potentially be better in a client>requests> structure, completely up to dev
            |-- functions   
                |-- some function
            |-- dbConnect.js
|-- schemas
    |-- appConfig.js
    |-- level1Config.js
    |-- dbConnectConfig.js //not necessarily evident that is a sub request, but that's mainly because theoretically it can be shared with appConfig or level1Config


|-- server  //how you nest these is up to you as you have the option to set the dir path, however best to set a folder for each view as vanillaBurst gives the abilitity to promise additional rollCall requests, especially useful for advanced instate functionality is required and state change aren't required
    |-- app 
        |-- appRequest.js //it must have the view landing name and Request affix
        |-- dbConnectRequest.js //for example this could be a connection that only makes sense in this scope and so you can have this request available so you can run it multiple times without changing states
    |-- level1
        |-- level1Request.js


vanillaBurst_NAMING_CONVENTION['views_and_functions]
a complete name set for a view would be as follows:

View level functions (landing, the renderSchema role=parent)
The client function logic: landing.js
The request file: landingRequest.js (customFunction in renderSchema, role=rollCall, auto condfig'd by vanillaBurst but must be manually determined giving granual control)
The config file: landingConfig.js

Function level functions (customFunctions of renderSchema)
The client function logic: customFunction.js
The config file: customFunction.js


Naming Conventions in vanillaBurst
View Level Functions (Landing, Role = 'parent' in renderSchema)
Client Function Logic:

Filename: landing.js
Description: This file contains the logic for the view level function, which represents a particular state or page of the application.
Request File:

Filename: landingRequest.js
Description: This is a custom function within renderSchema with the role of rollCall. It needs to be manually defined but is auto-configured by vanillaBurst. This file dictates what needs to be loaded and executed for the landing view.
Config File:

Filename: landingConfig.js
Description: This file sets up the configuration for the landing view, detailing its structure, dependencies, and behavior.
Function Level Functions (Custom Functions of renderSchema)
Client Function Logic:

Filename: customFunction.js
Description: Contains the logic for specific functionalities that are part of the renderSchema but are not the primary landing views.
Config File:

Filename: customFunctionConfig.js
Description: Defines the settings and properties for the custom function, such as directory paths, file names, and roles.
Example for a Specific Function Named "subNav"
Client Function Logic File: subnav.js
Config File: subnavConfig.js (for function-level functions)



vanillaBurst_CONFIG_RULE['view']
window.customFunctionConfig = function customFunctionConfig() {
    let customFunctionConfig ={}
    let passedConfig = {
        'customFunction': {
            'role':'parent',
            'dir': 'client/views/customFunction/',
            'functionFile': 'customFunction',
            'render': 'pause',
            'originBurst': 'customFunction',
            'htmlPath': 'client/views/customFunction/customFunction.html',
            'cssPath': 'client/views/customFunction/customFunction.css',
            'targetDOM': 'specificTargetDOM'
        },
        ...sharedParts
    };
    
    customFunctionConfig = { ...window.vanillaConfig('app', passedConfig) };

    return customFunctionConfig;
};


vanillaBurst_CONFIG_RULE['non-view']
Non-view custom functions should not include shared parts or call the vanillaConfig function for vanillaBurst scripts. They should only define properties relevant to their specific functionality.

Non-View Custom Function Configs Analysis
For non-view custom functions (e.g., level1, level2, etc.), the configuration should include only the properties necessary for their function and not shared parts or vanillaConfig function calls. Here's how these configs should be structured:

Example Structure for Non-View Custom Function Config
javascript
Copy code
window.customFunctionConfig = function customFunctionConfig() {
    let customFunctionConfig = {
        'customFunction': {
            'dir': 'client/views/customFunction/',
            'functionFile': 'customFunction',
            'render': 'pause',
            'originBurst': 'customFunction',
            'htmlPath': 'client/views/customFunction/customFunction.html',
            'cssPath': 'client/views/customFunction/customFunction.css',
            'targetDOM': 'specificTargetDOM',

        }
    };

    return customFunctionConfig;
};

Alternative way to build originBurst for any level of function, view or non-view
            'originBurst':{
                'namespace':'',
                'someprop':''somevalue,
                'someotherprop':[1,2,3,4],
                'anotherprop':{Object}
            }


vanillaBurst_REQUEST_RULE

In order for a view to be rendered, it must request the customFunctions within a view, which is built to window.schema, referenced by 'landing' property.

Here is an example, at minimum these must be met:

window.viewRequest = async function viewRequest(renderSchema, runFunction) {


  runFunction = window.runFunction;
  await runFunction;

  if (runFunction) {
    
    //these are the customFunctions config requests that will be used to build the application state
    rollCall = [
      'view', //each view needs to have a customFunction in its schema in order for the view to build, must match an defined reference in window.schema.landing[view] by this same name
      ...window.appviewPackage //use ... array spread for if there are actual multiple functions in the package
    ];

    await window.buildRollCall(renderSchema, rollCall, runFunction)

  }

};


vanillaBurst_CONFIG_RULE['app_level']

// Base URL for the application
window.baseUrl = "/"; //depending on your server this can be set to a relative or a definitive path

// Initial route of the application, should match a schemaPart that is NOT set to false
window.appRoute = 'app';

// Base URLs for custom assets
window.baseUrlIcons = "/assets/icons/";
window.baseUrlStyles = "/css/styles/";


// Define the routeParts based on the views
// the schemaParts are used to build window.schema an object available at any state of your application
//parts with null, string or arrays are landings that will have renderSchema available in its own state, meaning each time a new view is called, the renderSchema is of that view only
//false means the function is loaded but it is not a view so a view level config isn't built, it does become available for spread into configs with null or packaged functions
//null means the function is a view and will be built as a 'landing' in the window.schema, which will later in the app runtime be available as renderSchema
//'funcion1, function2' are function configs being spread to the values of the landing schema config, for renderSchema use
//['function1, function2, function3'], is a string in an array to identify a package, which calls shared function packages

here is an example of schema parts

window.schemaParts = {
  'appviewfunction': false,
  'sharedFunction1': false,
  'sharedFunction2': false,
  'app':'appviewfunction', //['uiPackage', 'scorePackage'], // Main app view with UI and score functionality
  'level1':['uiPackage'], //['level1SpecificPackage'], // Level 1 specific functionality
  'level2': null, // ['level2SpecificPackage'], // Level 2 specific functionality
  // Add additional levels as needed

};


window.uiPackage = ['sharedFunction1','sharedFunction2']; // Shared UI elements, references to the configs being defined as false in window.schemaParts

window.appviewPackage = ['appviewfunction','appviewfunction']; // Shared functions



vanillaBurst_CLIENT_RULE['functionFile']

This is the file that you create for the logic of the function you have built through configs.
it must be named as per the config of the function, ie if the functionConfig is 'subNavConfig' with the 'subNav' properties, the functionFile is window.subnav.
They must wait for runFunction flag in order to run. Quick way to turn off a function for testing. (although a better place to do this would be in the viewRequest file see vanillaBurst_REQUEST_RULE)

window.app = async function app() {

    if (window.runFunction === 'functionBurst') {

        //if your function requires html that you've set in your config via 'htmlPath' and 'cssPath properties then you can build it here
        //we set the domFunction to reference to equal the functionConfig
        //then call miniDOM with two ways of frame of thought: 1 if the config is a view level config such as your viewConfig, then the argument sets the customFunction to the method, 
            //and if the config is a functionConfig then it will pass the argumnt as the funtionFile to be used to accurately run miniDOM
            //we pass a callback function of what we want to run after the DOM is complete, in the example below we set a button to route to level1 view

        window.domFunction='app'

        window.miniDOM(window.appConfig(), 'app', initView);

        //if you've received data from the server through the use of dataSchema property in your functionConfig, you can call it here to build into your DOM as you wish through some function 
        //window.getData('app', populateHTMLContentInDivs)

                //poopulateHTMLContentInDivs can be run to make use of the serverResults
        //populateHTMLContentInDivs(appResult)
        //then do something like document.getElementById('someDiv').innerHTML = appResult.data[2] //and then set it to whatever property you have available in your result, usually determined by what the server is returning

        //initView will be run when window.miniDOM is complete
        function initView() {
            const startButton = document.getElementById('startGameButton');
            startButton.addEventListener('click', startLevel1Game);

            async function startLevel1Game() {

                //this is the simplest way to call a new view and change state, however there are additional methods such as window.stateDefine
                await window.routeCall('level1');

            }

        }

        //Additionally within this scope you can also access window.originBurst.app , window.renderSchema.subNav (if funciton or package has been passed to this view in config.js), and more


    } else {
        console.warn("app view: runFunction not set, halting execution.");
    }
}

