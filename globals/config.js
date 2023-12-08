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
  'app':['sharedFunction1Package'], //['uiPackage', 'scorePackage'], // Main app view with UI and score functionality
  'sharedFunction1': false,
  'level1': null, //['level1SpecificPackage'], // Level 1 specific functionality
  'level2': null // ['level2SpecificPackage'], // Level 2 specific functionality
  // Add additional levels as needed
};

// Define packages for shared and specific functionalities
window.uiPackage = ['nav', 'modals']; // Shared UI elements
window.scorePackage = ['scoreTracker']; // Shared score tracking functionality

window.level1SpecificPackage = ['puzzle1', 'challenge1']; // Specific components for Level 1
window.level2SpecificPackage = ['puzzle2', 'challenge2']; // Specific components for Level 2
window.sharedFunction1Package = ['sharedFunction1']
