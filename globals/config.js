// Base URL for the application
window.baseUrl = "/";

// Initial route of the application
window.appRoute = 'home';

// Base URLs for custom assets
window.baseUrlIcons = "/assets/icons/";
window.baseUrlStyles = "/css/styles/";

// Define the homeHtmlConfig




// Define the routeParts based on the views
window.schemaParts = {
  'appShell': false,
  'nav':false,
  'home': ['appShells'],
  'documentation':['appShells'],
  'warning':['appShells'],
  'gen': ['appShells'], //
  //'example':['uiPackage'], //['uiPackage'] means this function spreads configs from window.uiPackage 
  // Add additional levels as needed
};



window.appShells = ['appShell', 'nav'];