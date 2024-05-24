//

window.frozenVanilla("defaultAppRoute", "homeview");

window.appRoute = window.defaultAppRoute;

switch (window.mode) {
  case "dev": {
    window.frozenVanilla("domainUrl", "http://vanillaburstgame");
    break;
  }
  case "live": {
    window.frozenVanilla("domainUrl", "https://vanillaburstgame.onrender.com");
    break;
  }
}

//window.frozenVanilla("fetchDomainUrl", "");

window.frozenVanilla("registeredRoutes", [
  // "viewWithoutPackage", //see [PACKAGELESS VIEWS] below
  "homeview",
  "documentation",
  "gen",
]);

window.frozenVanilla("baseUrlIcons", "globals/brandAssets/assets/icons/");
window.frozenVanilla("baseUrlImages", "globals/brandAssets/assets/images/");
window.frozenVanilla("baseUrlStyles", "globals/brandAssets/css/styles/");

///////////////////////////////////////////////////////////////
//Define the routeParts based on the views
//string with comma dilimited array for array of multiple packages
//false for shared packages

// Define the routeParts based on the views
// [PACKAGELESS VIEWS] NOTE: If no app shells you can set the name of the view directly, or it won't load.
window.frozenVanilla(
  "schemaParts",
  Object.freeze({
    //viewWithoutPackage:["viewWithoutPackage"] // currently not auto promised, however it is equivalent to homeview, documentation, gen, and should also be in the registered routes above
    homeview: ["appShells, toppings"],
    myweather: false,
    nav: false,
    heroHeader: false,
    documentation: ["appShells"],
    gen: ["appShells"], //
  })
);
window.frozenVanilla("appShells", ["nav", "heroHeader"]);
window.frozenVanilla("toppings", ["myweather"]);
//'example':['uiPackage'], //['uiPackage'] means this function spreads configs from window.uiPackage
// Add additional levels as needed

window.frozenVanilla("vendorScoops", {
  vanillaParallax: ["homeview", "gen", "documentation"],
});
//define a vendor array or each one you want to use in the view config ie let vendors = [window.vanillaParallax] then

window.frozenVanilla("trustedSources", {
  //"default-src": ["'self'"],
  "img-src": [
    window.domainUrl,
    "https://arber.inc",
    "https://storage.googleapis.com",
    "https://cdn.weatherapi.com",
  ],
  "media-src": [
    window.domainUrl,
    "https://arber.inc",
    "https://storage.googleapis.com",
  ],
  "style-src": [window.domainUrl],
  "object-src": ["'none'"],
  "font-src": [
    window.domainUrl,
    "https://arber.inc",
    "https://storage.googleapis.com",
  ],
  "connect-src": [
    window.domainUrl,
    "https://arber.inc",
    "https://storage.googleapis.com",
    "https://weatherapi-com.p.rapidapi.com",
    window.domainUrl, // Add window.domainUrl here
  ],
  "manifest-src": [
    window.domainUrl,
    "https://arber.inc",
    "https://storage.googleapis.com",
  ],
  "worker-src": [
    window.domainUrl,
    "https://arber.inc",
    "https://storage.googleapis.com",
  ],
  "child-src": [
    window.domainUrl,
    "https://arber.inc",
    "https://storage.googleapis.com",
  ],
  // "frame-ancestors": ["'none'"], // Not supported in <meta> tag
  // "form-action": ["'none'"],
  // "base-uri": ["'self'"],
});

window.setTrustedSources(window.trustedSources);
