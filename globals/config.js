// Base URL for the application
window.baseUrl = "/";

// Initial route of the application
window.appRoute = 'app';

// Base URLs for custom assets
window.baseUrlIcons = "/assets/icons/";
window.baseUrlStyles = "/css/styles/";

// Define the homeHtmlConfig



// Define the routeParts based on the views
window.schemaParts = {
  'app': ['levelsPackage'],
  'level1': false,
  'level2': false,

};



// Define shared parts, common functionalities used across views, modular approach
//Config is concatted in schema.js, but because this will be used as a array spread in custom usage and in viewRequests, it's better to keep the name of the view in this package
window.levelsPackage = ['level1','level2']; 

//window.uiPackage = ['nav, score']; //calls navConfig, scoreConfig, and schema.js spreads the object to ie appConfig, we'll implement this later..TODO

