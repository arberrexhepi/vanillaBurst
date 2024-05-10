// User defined

const mode = "dev"; //or "live"

const devBaseUrl = "/";
const liveBaseUrl = "/";

switch (mode) {
  case "dev": {
    baseUrl = devBaseUrl;
    break;
  }
  case "live": {
    baseUrl = liveBaseUrl;
    break;
  }
}

///You should try frozenVanilla! it's awesome
try {
  if (window.frozenVanilla === undefined) {
    Object.defineProperty(window, "frozenVanilla", {
      value: function frozenVanilla(prop, value, setAsWindowProp = true) {
        let frozenValue;
        if (typeof value === "function") {
          // Handle functions
          frozenValue = function (...args) {
            return value.apply(this, args);
          };
          frozenValue = Object.freeze(value);
        } else {
          // Handle simple values
          frozenValue = Object.freeze(value);
        }

        if (setAsWindowProp) {
          if (
            window[prop] === undefined ||
            window[prop] === null ||
            Object.getOwnPropertyDescriptor(window, prop).writable
          ) {
            Object.defineProperty(window, prop, {
              value: frozenValue,
              writable: false,
              configurable: false,
            });
          }
        }
        return frozenValue;
      },
      writable: false,
      configurable: false,
    });
  }
} catch (error) {
  console.error(
    "Oops, looks like we dropped your vanilla, we'll try preparing it again!",
    error
  );
  window.location.reload(); // Reload the current page
}

const isFrozen = function isFrozen(prop, type) {
  // Check if the property exists
  if (window[prop] === undefined) {
    return false;
  }

  // Check if the property is frozen
  if (!Object.isFrozen(window[prop])) {
    return false;
  }

  // Check if the property is of the correct type
  if (typeof window[prop] !== type) {
    return false;
  }

  // If all checks pass, return true

  return true;
};
///let's freeze the gauge!

window.frozenVanilla("isFrozen", isFrozen);

///////

window.frozenVanilla("baseUrl", baseUrl);

///// vanillaBurst App
window.renderComplete = "false";

////

const vanillaApp = window.frozenVanilla(
  "vanillaApp",
  function vanillaApp() {
    let baseUrl = window.baseUrl;
    window.onload = function () {
      // Load script helper function
      console.log(".");
      console.log(".");
      console.log(".");
      console.info({ Status: "build renderSchema" });
      console.log(".");
      console.log(".");
      console.log(".");

      function verifiedRoute(path) {
        for (let route of window.registeredRoutes) {
          if (path.includes(route)) {
            return route;
          }
        }
        return null; // return null if no route matches
      }

      window.frozenVanilla("path", window.location.pathname.replace(/^\//, ""));

      window.frozenVanilla("loadScript", function loadScript(url) {
        return new Promise((resolve, reject) => {
          // Create a new script element
          const script = document.createElement("script");

          script.src = url;
          script.setAttribute("name", "init");
          script.onload = () => resolve(script);

          script.onerror = () =>
            reject(new Error(`Failed to load script: ${url}`));

          // Add the script to the document (this starts the loading process)
          script.setAttribute("name", "init");
          document.head.appendChild(script);
        });
      });
      const configScriptPath = "globals/config.js";
      window.frozenVanilla("configScriptPath", configScriptPath, false);
      // Function to load initial scripts and then run promise1
      window.frozenVanilla("loadInitialScripts", function loadInitialScripts() {
        return Promise.all([window.loadScript(`${baseUrl}${configScriptPath}`)])
          .then(() => {
            return window.schemaParts; // Assuming schemaParts is defined and returned here
          })
          .catch((error) => {
            console.error("Script loading error: ", error);
          });
      });

      // Function to handle first batch of promises
      function promise1() {
        // Extract just the keys from window.schemaParts
        const parts = Object.keys(window.schemaParts);
        window.frozenVanilla("parts", parts, false);

        console.log("Extracted parts (keys):", parts);

        // Map pars to get script files
        const scriptPromises = parts.map((part) => {
          const partConfigPath = `schemas/${part}Config.js`;
          window.frozenVanilla("partConfigPath", partConfigPath, false);

          const scriptUrl = `${baseUrl}${partConfigPath}`;
          window.frozenVanilla("scriptUrl", scriptUrl, false);

          // load the script
          return window.loadScript(scriptUrl).catch((error) => {
            console.error(
              `Error loading [view]Config for part: ${part}`,
              error
            );
          });
        });

        // Also load the schema.js script
        const schemaScriptPath = "vanillaBurstScripts/schema.js";
        window.frozenVanilla("schemaScriptPath", schemaScriptPath, false);

        scriptPromises.push(
          window.loadScript(`${baseUrl}${schemaScriptPath}`).catch((error) => {
            console.error("Error loading schema.js script", error);
          })
        );

        // Setup script promise and then build the schema
        return Promise.all(scriptPromises, parts)
          .then(() => {
            console.info("CONFIG PARTS PROMISED:", parts);

            if (typeof config === "function") {
              const schema = config();

              window.frozenVanilla("schema", schema);

              promise2(schema); // Call promise2 with the schema
            } else {
              console.error("window.config is not a function.");
            }
          })
          .catch((error) => {
            console.error(
              "An error occurred during script loading or execution at schema build: ",
              error
            );
          });
      }

      ///concats base URL
      const statesScriptPath = `vanillaBurstScripts/states.js`;
      window.frozenVanilla("statesScriptPath", statesScriptPath, false);

      const routesScriptPath = `vanillaBurstScripts/routes.js`;
      window.frozenVanilla("routesScriptPath", routesScriptPath, false);

      // Function to handle second batch of promises (states & routes)
      async function promise2(schema) {
        // Load states.js script
        window
          .loadScript(`${baseUrl}${statesScriptPath}`)
          .then(() => {
            // After states.js is loaded, load routes.js script
            return window.loadScript(`${baseUrl}${routesScriptPath}`);
          })
          .then(() => {
            //maybe get the route here? could help with full makeAgain

            // Call the route
            window.vanillaBurst(
              (renderComplete = false),
              (route = path),
              (routeCycles = 0)
            );

            console.log("Scripts states.js and routes.js loaded successfully.");
          })
          .catch((error) => {
            console.error(
              "Scripts states.js and routes.js could not be loaded at script.js: ",
              error
            );
          });
      }

      // Array of scripts to be used in the application
      if (window.vanillaBurstScripts === undefined) {
        Object.defineProperty(window, "vanillaBurstScripts", {
          value: Object.freeze([
            //baseUrl + 'globals/loader.js',
            baseUrl + "vendors/jquery-3.7.1.min.js",
            baseUrl + "vendors/purify.min.js",
            baseUrl + "globals/config.js",
            baseUrl + "vanillaBurstScripts/vanillaElements.js",
            baseUrl + "vanillaBurstScripts/dom.js",
            baseUrl + "vanillaBurstScripts/serverRender.js",
            baseUrl + "vanillaBurstScripts/singlePromise.js",
            baseUrl + "vanillaBurstScripts/signals.js",
            baseUrl + "vanillaBurstScripts/render.js",
            baseUrl + "vanillaBurstScripts/originBurst.js",
            baseUrl + "vanillaBurstScripts/childFunction.js",
          ]),
          writable: false,
          configurable: false,
        });
      } else {
        window.vanillaBurstScripts();
      }

      // Start the promise chain
      loadInitialScripts().then((schemaParts) => {
        promise1(schemaParts).then((runFunction = true) => {
          if (
            runFunction === true &&
            typeof window[renderSchema.landing] === "function"
          ) {
            console.log(".");
            console.log(".");
            console.log(".");
            console.log(".");
            console.info({ Status: "...loading vanillaBurst scripts..." });
            console.log(".");
            console.log(".");
            console.log(".");
          }
        });
      });
    };
  },
  false
);

vanillaApp();
