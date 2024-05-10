//

window.frozenVanilla("defaultAppRoute", "homeview");

window.appRoute = window.defaultAppRoute;

window.frozenVanilla("domainUrl", "http://vanillaburstgame");

window.frozenVanilla("fetchDomainUrl", "");

window.frozenVanilla("registeredRoutes", ["homeview", "documentation", "gen"]);

window.frozenVanilla("baseUrlIcons", "/assets/icons/");

window.frozenVanilla("baseUrlStyles", "/css/styles/");

///////////////////////////////////////////////////////////////
//Define the routeParts based on the views
//string with comma dilimited array for array of multiple packages
//false for shared packages

// Define the routeParts based on the views
window.frozenVanilla(
  "schemaParts",
  Object.freeze({
    homeview: ["appShells"],
    nav: false,
    documentation: ["appShells"],
    gen: ["appShells"], //
  })
);
window.frozenVanilla("appShells", ["nav"]);

//'example':['uiPackage'], //['uiPackage'] means this function spreads configs from window.uiPackage
// Add additional levels as needed
