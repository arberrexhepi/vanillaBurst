# vanillaBurst

Copyright © arbër inc

**Apache 2.0 License**

## What is vanillaBurst?

vanillaBurst is a JS packaging framework, useable as a standalone or plugin solution. It ensures your required files are always ready for the function you are working with, and for the dom and server you are interacting with.

- You can control the behaviour of an existing JS project or create your own entirely! It builds and prepares the project as [vanillaApp]
- At its core, no additional helper functions actually need to be used… if all you need is JS files promised exactly where you need them for you to work with, then config.js, viewConfig.js and view.js is all that’s necessary. In terms of something like Wordpress, you’ll - ideallistically - never wonder why your clicks aren’t firing again!

## What else can vanillaBurst do?

- Beyond packing and load balancing of a project’s files by endpoint i.e: ?burst=home, vanillaBurst has the capability for state caching and state interaction via server calls and signals.
- The simplified server communication [helper function "serverRender"] alongside the [helper function "myBurst"] allows for dynamic and quick interaction and availability.

## How does vanillaBurst work? and how Do I use it?

- From a system standpoint, vanillaBurst packs and readies your [view routes as "landing"] based on the following setups of a developer using vanillaBurst: declaring "schemaParts" along with packages for any given "landing", declaring per "landing" - and/or "customFunction" config.js, and creating the "landing" and optionally "customFunction" .js files which holds the code for the code that runs on "landing" render completion.

[File reference "script.js"]

- Setting GLOBAL [immutable >>variables>> via [helper function window.frozenVanilla()]: baseUrl, appRoute

[END File reference "script.js"]

[File reference "global/config.js"]

- Setting GLOBAL [immutable >>variables>> via [helper function window.frozenVanilla()]: domainUrl, baseUrl, appRoute
- Declaration of ["schemaParts" for "schema"]; these are all your "landing" endpoints and available functions in the project.
- Declaration of ["packages" for "schemaParts"]; these are shared functions that can be passed to any "schemaParts" properties ("landing")
  configs are the building blocks of your JS project.
- Declaration of ["configs" as "schemaParts"]; each "landing" requires a ["landingConfig()" for "landing"]. (SEE [INFO SET - What are configs?])

Provided these tasks are complete, vanillaBurst will autorun when the "landing" is in the window.location.path

## What are vanillaBurst configs?

- From a system standpoint, configs are the required setups for vanillaBurst to auto run and balance your "landing".
- From a developer standpoint configs are sets of directives that control the state rendering promise of vanillaBurst.
- The benefit of configuring by vanillaBurst standards is that it provides a central observable overview of how a "landing", "customFunction" or the entirety of a "vanillaApp" operates. It works as a great way to plan a "landing" and "customFunction" and all the while painlessly taking care of the rendering, based on your plan!
- This approach allows a developer to focus on functinality rather than function file management in their readied .js files.

## Config Features

- You can; setup up your data structure, access privileges by namespace, control render or pause at runtime for load balancing, you can pass custom default properties to the schema via an "originBurst" object, setup html and css calls to target for DOM Rendering to your "landing", and include vendors (SEE [DIRECTIVE SAMPLE SET - Landing Config])
- The config.js allows for share functions which can be setup as packages (SEE File Reference "global/config.js"]), but it's not necessary because you can decied to place "customFunction" configs within the `${landing}Config.js`. But that’s of course not recommended if you are planning a larger scale project. (SEE [DIRECTIVE SAMPLE - Unparted Landing Config])
- For any future reconsiderations for a growing project, reconfiguration is super simple and the vanillaApp will function as always if you setup the schemaParts[landing] with the new configs as packages. ie: schemaParts[landing]=["uiPackage, navPackage"] which is a string that spreads array of configs into the `${landing}Config(sharedParts)` (SEE [DIRECTIVE SAMPLE - Packaged Landing Config])

## Server Interaction

- vanillaBurst is server agnostic, requiring nothing more than an environment that can run JS and has some form of server level directive capabilities (ie; apache .htaccess).
- vanillaBurst securely loads and sanitizes HTML files and CSS and make calls based on config available endpoints via serverRender and can be configured as signals or a direct return.
- vanillaBurt's serverRender() function uses the fetch API, and accepts a dataSchema to complete a request. A proxy server is highly recommended or a secure endpoint of any choice, provided you understand what you are transmitting and receiving. -
- What server language you use is not an opinion vanillaBurst aims to hold, as it is not its intent or value.
- Caching is promised by default for any of these files, including any html and css that you might add to the viewConfig.js

...

## About customFunction.js

- customFunctions are .js files that are promised at runtime. They are cached, and ran each time the "landing" is in the history event state. Efficiently, only functions set to render:"burst" and within the "landing" are ever run.
- Landing customFunctions [object at schema[landing].customFunctions.customFunction[customFunction]], that have property dataSchema: {data: auto...} are also auto run, or can be set to data:false for manual communication.
- customFunction.js is the unique name reference in all parts of your vanillaApp files and configs. You'll know if you're calling something incorrectly because the app will fail at that exact point, giving you feedback at failure.

## Naming Conventions

- Config file: customFunctionConfig.js
- Config function: customFunctionConfig
- Object property key name { customFunction :{}}
- Object property param {...customFunction: {functionFile: "customFunction", ...}}
- If customFunction is the landin - set {...customFunciton:{role: "parent", ...}}

## Basic customFunction.js setup

[INFO SET]

- The customFunction is wrapped in helper function to disallow mutation of the function
- vanillaApp promises a "vanillaPromise" from which a developer can access and communicate with the state. (SEE [DIRECTIVE SET - Vanilla Promise])
- The code in this file can be purely vanilla JS, hence "vanillaBurst", can access helper functions, or if a particular library such as jQuery is included as in passedVendors property of a landingConfig, the code may be written in that fashion.
- vanillaBurst's helper functions are immutable and available for use to communicate with other files and functionalities.

[SAMPLE]
///start file

window.frozenVanilla('customFunction', function(vanillaPromise){

console.log(vanillaPromise.this + "has run");

});

////end file

...

## vanillaBurst Signals

[INFO SET]

- Signals are carried out via helper function window.myBurst() by dev and it uses the storeBurst to cache and localize the data, scoping it where needed.
- If the dataSchema object has been written in the configs, no additional setups are required when calling the sever for that particular default (provided the server responds with a signal type and data || defaults to ready and fail);

## Signals with Server Interaction

(SEE GITHUB REPO FILE https://github.com/arberrexhepi/vanillaBurstGame/blob/main/samples/notificationHandlerSample.js)

...

##TODO - add more documentation

...
