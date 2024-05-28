//

ë.frozenVanilla("defaultAppRoute", "homeview");

ë.appRoute = ë.defaultAppRoute;

switch (ë.mode) {
  case "dev": {
    ë.frozenVanilla("domainUrl", "http://vanillaburstgame", false);
    ë.frozenVanilla("vanillaStock", false);
    break;
  }
  case "live": {
    ë.frozenVanilla(
      "domainUrl",
      "https://vanillaburstgame.onrender.com",
      false
    );
    ë.frozenVanilla("vanillaStock", false);

    break;
  }
}

//ë.frozenVanilla("fetchDomainUrl", ""); if default you can set it here, or set it per call to dataSchema.url in functionConfig.js

ë.frozenVanilla(
  "registeredRoutes",
  [
    // "viewWithoutPackage", //see [PACKAGELESS VIEWS] below
    "homeview",
    "documentation",
    "gen",
  ],
  false
);

ë.frozenVanilla("baseUrlIcons", "globals/brandAssets/assets/icons/");
ë.frozenVanilla(
  "baseUrlImages",
  "https://storage.googleapis.com/arberinc_public/vanillaBurst/brandAssets/images/"
);
ë.frozenVanilla("baseUrlStyles", "globals/brandAssets/css/styles/"); //preparing for built-in css system

///////////////////////////////////////////////////////////////
//Define the routeParts based on the views
//string with comma dilimited array for array of multiple packages
//false for shared packages

// Define the routeParts based on the views
// [PACKAGELESS VIEWS] NOTE: If no app shells you can set the name of the view directly, or it won't load.
ë.frozenVanilla(
  "schemaParts",
  Object.freeze({
    //viewWithoutPackage:["viewWithoutPackage"] //[PACKAGELESS VIEWS] currently you pass the very same function as a package
    homeview: ["appShells, toppings"], //[VIEW with package]
    myweather: false, //[SHARED PACKAGE FUNCTION]
    nav: false, //[SHARED PACKAGE FUNCTION]
    heroHeader: false, //[SHARED PACKAGE FUNCTION]
    documentation: ["appShells"], //[VIEW with package]
    gen: ["appShells"], //[VIEW with package]
  })
);
ë.frozenVanilla("appShells", ["nav", "heroHeader"]);
ë.frozenVanilla("toppings", ["myweather"]); //this is particular package is a scoop but it is an internal scoop not installed as plugin, so it can be set as a package
//'example':['uiPackage'], //['uiPackage'] means this function spreads configs from ë.uiPackage
// Add additional levels as needed

//scoops should be in scoops/scoopName/scoopName.js
ë.frozenVanilla("vanillaScoops", {
  //vanillaAnimation: ["homeview", "gen", "documentation"], OR set it as global as below
  vanillaAnimation: true,
  vanillaCSS: true,
  gptScoop: ["homeview"],
});

//define a vendor array or each one you want to use in the view config ie let vendors = [ë.vanillaParallax] then

ë.frozenVanilla(
  "trustedSources",
  {
    //"default-src": ["'self'"],
    "img-src": [
      ë.frozenVanilla.get("domainUrl"),
      "https://arber.inc",
      "https://storage.googleapis.com",
      "https://cdn.weatherapi.com",
    ],
    "media-src": [
      ë.frozenVanilla.get("domainUrl"),
      "https://arber.inc",
      "https://storage.googleapis.com",
    ],
    "style-src": [ë.domainUrl],
    "object-src": ["'none'"],
    "font-src": [
      ë.frozenVanilla.get("domainUrl"),
      "https://arber.inc",
      "https://storage.googleapis.com",
    ],
    "connect-src": [
      ë.frozenVanilla.get("domainUrl"),
      "https://arber.inc",
      "https://storage.googleapis.com",
      "https://weatherapi-com.p.rapidapi.com",
      "https://jsonplaceholder.typicode.com",
      ë.frozenVanilla.get("domainUrl"), // Add ë.domainUrl here
    ],
    "manifest-src": [ë.frozenVanilla.get("domainUrl"), "https://arber.inc"],
    "worker-src": [ë.frozenVanilla.get("domainUrl"), "https://arber.inc"],
    "child-src": [ë.frozenVanilla.get("domainUrl"), "https://arber.inc"],
    // "frame-ancestors": ["'none'"], // Not supported in <meta> tag
    // "form-action": ["'none'"],
    // "base-uri": ["'self'"],
  },
  false
);

ë.setTrustedSources(ë.frozenVanilla.get("trustedSources"));
