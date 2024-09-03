function loadConfig(config) {
  return new Promise((resolve, reject) => {
    try {
      // Set defaultAppRoute
      ë.frozenVanilla("defaultAppRoute", config.defaultAppRoute);

      // Set appRoute
      ë.appRoute = config.defaultAppRoute;

      // Set domainUrl and vanillaStock based on mode

      // Set registeredRoutes
      if (Array.isArray(config.registeredRoutes)) {
        ë.frozenVanilla("registeredRoutes", config.registeredRoutes);
      } else {
        ë.logSpacer("Invalid registeredRoutes format in config.json");
        reject(new Error("Invalid registeredRoutes format in config.json"));
        return;
      }

      // Set verbosity caller
      if (
        (config?.vanillaMessCaller &&
          config?.vanillaMessCaller !== undefined) ||
        config?.vanillaMessCaller !== null
      ) {
        if (Array.isArray(config.vanillaMessCaller)) {
          ë.frozenVanilla("vanillaMessCaller", config.vanillaMessCaller);
        } else {
          ë.logSpacer("Invalid vanillaMessCaller format in config.json");
          reject(new Error("Invalid vanillaMessCaller format in config.json"));
          return;
        }
      } else {
        ë.logSpacer("Not debugging any vanillaScoops.");
      }

      // Set baseUrl paths.

      ë.frozenVanilla("baseUrlIcons", config.baseUrlIcons);
      ë.frozenVanilla("baseUrlImages", config.baseUrlImages);
      ë.frozenVanilla("baseUrlStyles", config.baseUrlStyles);
      if (config.vendors && Array.isArray(config.vendors)) {
        ë.frozenVanilla("vendorConfig", config.vendors, false);
      } else {
        ë.frozenVanilla("vendorConfig", undefined, false);
      }

      // Set schemaParts
      let schemaParts;
      if (config.schemaParts && typeof config.schemaParts === "object") {
        schemaParts = Object.freeze(config.schemaParts);
        ë.frozenVanilla("schemaParts", schemaParts, false);
      } else {
        ë.logSpacer("Invalid schemaParts format in config.json");
        reject(new Error("Invalid schemaParts format in config.json"));
        return;
      }

      // Set packages dynamically
      if (config.packages && typeof config.packages === "object") {
        Object.entries(config.packages).forEach(([key, value]) => {
          ë.frozenVanilla(key, value);
        });
      } else {
        ë.logSpacer("Invalid packages format in config.json");
        reject(new Error("Invalid packages format in config.json"));
        return;
      }

      // Set vanillaScoops
      if (config.vanillaScoops && typeof config.vanillaScoops === "object") {
        ë.frozenVanilla("vanillaScoops", config.vanillaScoops);
      } else {
        ë.logSpacer("Invalid vanillaScoops format in config.json");
        reject(new Error("Invalid vanillaScoops format in config.json"));
        return;
      }

      // Set trustedSources
      if (config.trustedSources && typeof config.trustedSources === "object") {
        ë.frozenVanilla("trustedSources", config.trustedSources);
        ë.setTrustedSources(ë.frozenVanilla.get("trustedSources"));
      } else {
        ë.logSpacer("Invalid trustedSources format in config.json");
        reject(new Error("Invalid trustedSources format in config.json"));
        return;
      }

      // Resolve with schemaParts once all settings are applied
      resolve(schemaParts);
    } catch (err) {
      ë.logSpacer("Error processing config:", err);
      reject(err);
    }
  });
}
