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
    heroHeader: false,
    documentation: ["appShells"],
    gen: ["appShells"], //
  })
);
window.frozenVanilla("appShells", ["nav", "heroHeader"]);

//'example':['uiPackage'], //['uiPackage'] means this function spreads configs from window.uiPackage
// Add additional levels as needed

window.frozenVanilla("trustedSources", {
  //"default-src": ["'self'"],
  "img-src": [
    window.domainUrl,
    "https://arber.inc",
    "https://storage.googleapis.com",
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
