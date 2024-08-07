ë.frozenVanilla("defaultAppRoute", "homeview");

ë.appRoute = ë.defaultAppRoute;

switch (ë.mode) {
  case "dev": {
    ë.frozenVanilla("domainUrl", "http://vanillaburstgame");
    ë.frozenVanilla("vanillaStock", true);
    break;
  }
  case "live": {
    ë.frozenVanilla("domainUrl", "https://vanillaburstgame.onrender.com");
    ë.frozenVanilla("vanillaStock", false);

    break;
  }
}

ë.frozenVanilla(
  "registeredRoutes",
  ["homeview", "documentation", "generate"],
  false
);

ë.frozenVanilla("baseUrlIcons", "globals/brandAssets/assets/icons/");

ë.frozenVanilla(
  "baseUrlImages",
  "https://storage.googleapis.com/arberinc_public/vanillaBurst/brandAssets/images/"
);
ë.frozenVanilla("baseUrlStyles", "globals/brandAssets/css/styles/"); //preparing for built-in css system

ë.frozenVanilla(
  "schemaParts",
  Object.freeze({
    homeview: ["appShells, homeviewToppings"],
    documentation: ["appShells"],
    generate: ["appShells"],
    "component/nav": [],
    "component/myweather": false,
    "component/myfooter": [],
    "component/heroHeader": [],
  })
);
ë.frozenVanilla("appShells", ["nav", "heroHeader", "myfooter"]);
ë.frozenVanilla("homeviewToppings", ["myweather"]);

ë.frozenVanilla("vanillaScoops", {
  vanillaAnimation: true,
  vanillaImages: true,
  linkBurst: true,
  gptScoop: ["homeview"],
});

ë.frozenVanilla(
  "trustedSources",
  {
    //"default-src": ["'self'"],
    "img-src": [
      ë.domainUrl,
      "https://arber.design",
      "https://storage.googleapis.com",
      "https://cdn.weatherapi.com",
    ],
    "media-src": [
      ë.domainUrl,
      "https://arber.design",
      "https://storage.googleapis.com",
    ],
    "style-src": [ë.domainUrl],
    "object-src": ["'none'"],
    "font-src": [
      ë.domainUrl,
      "https://arber.design",
      "https://storage.googleapis.com",
    ],
    "connect-src": [
      ë.domainUrl,
      "https://arber.design",
      "https://storage.googleapis.com",
      "https://weatherapi-com.p.rapidapi.com",
      "https://jsonplaceholder.typicode.com",
    ],
    "manifest-src": [ë.domainUrl, "https://arber.design"],
    "worker-src": [ë.domainUrl, "https://arber.design"],
    "child-src": [ë.domainUrl, "https://arber.design"],
    // "frame-ancestors": ["'none'"], // Not supported in <meta> tag
    // "form-action": ["'none'"],
    // "base-uri": ["'self'"],
  },
  false
);

ë.setTrustedSources(ë.frozenVanilla.get("trustedSources"));
