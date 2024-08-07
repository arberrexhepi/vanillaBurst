function loadConfig(config) {
  return new Promise((resolve, reject) => {
    try {
      // Set defaultAppRoute
      ë.frozenVanilla("defaultAppRoute", config.defaultAppRoute);

      // Set appRoute
      ë.appRoute = config.defaultAppRoute;

      // Set domainUrl and vanillaStock based on mode
      if (config.mode && config.domainUrl && config.domainUrl[config.mode]) {
        ë.frozenVanilla("domainUrl", config.domainUrl[config.mode]);
        ë.frozenVanilla("vanillaStock", config.vanillaStock);
      } else {
        console.error(
          "Unknown mode or invalid domainUrl structure:",
          config.mode
        );
        reject(
          new Error("Unknown mode or invalid domainUrl structure in config")
        );
        return;
      }

      // Set registeredRoutes
      if (Array.isArray(config.registeredRoutes)) {
        ë.frozenVanilla("registeredRoutes", config.registeredRoutes);
      } else {
        console.error("Invalid registeredRoutes format in config.json");
        reject(new Error("Invalid registeredRoutes format in config.json"));
        return;
      }

      // Set baseUrl paths
      ë.frozenVanilla("baseUrlIcons", config.baseUrlIcons);
      ë.frozenVanilla("baseUrlImages", config.baseUrlImages);
      ë.frozenVanilla("baseUrlStyles", config.baseUrlStyles);

      // Set schemaParts
      let schemaParts;
      if (config.schemaParts && typeof config.schemaParts === "object") {
        schemaParts = Object.freeze(config.schemaParts);
        ë.frozenVanilla("schemaParts", schemaParts);
      } else {
        console.error("Invalid schemaParts format in config.json");
        reject(new Error("Invalid schemaParts format in config.json"));
        return;
      }

      // Set packages dynamically
      if (config.packages && typeof config.packages === "object") {
        Object.entries(config.packages).forEach(([key, value]) => {
          ë.frozenVanilla(key, value);
        });
      } else {
        console.error("Invalid packages format in config.json");
        reject(new Error("Invalid packages format in config.json"));
        return;
      }

      // Set vanillaScoops
      if (config.vanillaScoops && typeof config.vanillaScoops === "object") {
        ë.frozenVanilla("vanillaScoops", config.vanillaScoops);
      } else {
        console.error("Invalid vanillaScoops format in config.json");
        reject(new Error("Invalid vanillaScoops format in config.json"));
        return;
      }

      // Set trustedSources
      if (config.trustedSources && typeof config.trustedSources === "object") {
        ë.frozenVanilla("trustedSources", config.trustedSources);
        ë.setTrustedSources(ë.frozenVanilla.get("trustedSources"));
      } else {
        console.error("Invalid trustedSources format in config.json");
        reject(new Error("Invalid trustedSources format in config.json"));
        return;
      }

      // Resolve with schemaParts once all settings are applied
      resolve(schemaParts);
    } catch (err) {
      console.error("Error processing config:", err);
      reject(err);
    }
  });
}
