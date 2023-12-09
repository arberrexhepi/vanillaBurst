// Base URL for the application
window.baseUrl = "/";

// Initial route of the application
window.appRoute = 'app';

// Base URLs for custom assets
window.baseUrlIcons = "/assets/icons/";
window.baseUrlStyles = "/css/styles/";

// Define shared parts, common functionalities used across views
window.utilitiesPackage = ['utility1', 'utility2']; // Replace with actual utility names
window.solverPackage = ['activateSolveButton', 'checkPuzzleSolved', 'advanceToNextLevel', 'provideFeedback'];

// Define the routeParts based on the views
window.schemaParts = {
  'app': ['levelsPackage', 'utilitiesPackage', 'solverPackage'],
  'level1': false,
  'level2': false,
  // Add other views and their packages as necessary
};

// Define packages for levels
window.levelsPackage = ['level1', 'level2']; // Add more levels as they are created
