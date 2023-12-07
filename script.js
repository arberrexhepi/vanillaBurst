// User defined
window.baseUrl = "/";

// vanillaBurst App
window.renderComplete = "false";

window.vanillaApp = function vanillaApp(baseUrl) {
  window.$ = jQuery;

  window.onload = function() {    // Load script helper function
    window.loadScript = function loadScript(url) {
      return fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then(scriptContent => {
          eval(scriptContent);
        })
        .catch(error => {
          console.error('Failed to load script:', url, error);
        });
    };

    // Function to load initial scripts and then run promise1
    function loadInitialScripts() {
      return Promise.all([
        window.loadScript(`${window.baseUrl}globals/config.js`)
      ]).then(() => {
        return window.schemaParts; // Assuming schemaParts is defined and returned here
      }).catch(error => {
        console.error("Script loading error: ", error);
      });
    }

    // Function to handle first batch of promises
    function promise1() {
      // Extract just the keys from window.schemaParts
      const parts = Object.keys(window.schemaParts);
    
      // Log the extracted parts
      console.log("Extracted parts (keys):", parts);
    
      // Map over parts to load scripts
      const scriptPromises = parts.map(part => {
        const scriptUrl = `${window.baseUrl}schemas/${part}Config.js`;
        console.log("Attempting to load script:", scriptUrl);
    
        // Use window.loadScript to load the script
        return window.loadScript(scriptUrl).catch(error => {
          console.error(`Error loading script for part: ${part}`, error);
        });
      });
    
      // Also load the schema.js script
      scriptPromises.push(
        window.loadScript(`${window.baseUrl}schema.js`).catch(error => {
          console.error("Error loading schema.js script", error);
        })
      );
    
      // Load all scripts and then build the schema
      return Promise.all(scriptPromises).then(() => {
        if (typeof window.config === 'function') {
          const schema = window.config();
          window.schema = schema;
          promise2(schema); // Call promise2 with the schema
        } else {
          console.error("window.config is not a function.");
        }
      }).catch(error => {
        console.error("An error occurred during script loading or execution: ", error);
      });
    }
    
    
    
    

    // Function to handle second batch of promises
    function promise2(schema) {
      // Load states.js script
      window.loadScript(`${window.baseUrl}states.js`).then(() => {
        // After states.js is loaded, load routes.js script
        return window.loadScript(`${window.baseUrl}routes.js`);
      }).then(() => {
        // After routes.js is loaded, perform any additional actions if needed
        window.vanillaBurst(window.renderComplete, window.route, window.routeCycles);
        console.log("Scripts states.js and routes.js loaded successfully.");
      }).catch(error => {
        console.error("Script loading error in promise2: ", error);
      });
    
      // // Load Stylesheet helper function
      // window.loadStyleSheet = function loadStyleSheet(path) {
      //   var head = document.head;
      //   var link = document.createElement("link");
      //   link.type = "text/css";
      //   link.rel = "stylesheet";
      //   link.href = path;
      //   head.appendChild(link);
      // };
    
      // // Example of how to load a stylesheet
      // // window.loadStyleSheet(window.baseUrl + "path/to/stylesheet.css");
    }
    

    // Array of scripts to be used in the application
    window.vanillaBurstScripts = [
      //window.baseUrl + 'globals/loader.js',
      window.baseUrl + 'globals/config.js',
      window.baseUrl + 'serverRender.js',
      window.baseUrl + 'singlePromise.js',
      window.baseUrl + 'childFunction.js',
      window.baseUrl + 'render.js',
    ];

    // Start the script loading process
    loadInitialScripts().then(schemaParts => {
      promise1(schemaParts);
    });
  }
};

window.vanillaApp(window.baseUrl);
