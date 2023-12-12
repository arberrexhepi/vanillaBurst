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
  'appviewfunction': false,
  'sharedFunction1': false,
  'sharedFunction2': false,
  'app':['appviewPackage'], //['uiPackage', 'scorePackage'], // Main app view with UI and score functionality
  'level1':['uiPackage'], //['level1SpecificPackage'], // Level 1 specific functionality
  'level2': null, // ['level2SpecificPackage'], // Level 2 specific functionality
  // Add additional levels as needed

};


window.uiPackage = ['sharedFunction1','sharedFunction2']; // Shared UI elements

window.appviewPackage = ['appviewfunction','sharedFunction2']; // Shared UI elements