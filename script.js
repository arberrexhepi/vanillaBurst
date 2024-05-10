const mode = "live"; // "dev" or "live"

const devBaseUrl = "/";
const liveBaseUrl = "/";

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
            (window[prop] &&
              Object.getOwnPropertyDescriptor(window, prop).writable)
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

///You should try frozenVanilla! it's awesome

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

const domainUrl = window.location.origin + "/";

///let's freeze the gauge!

window.frozenVanilla("isFrozen", isFrozen);

///////

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

window.frozenVanilla("mode", mode);

window.frozenVanilla("baseUrl", baseUrl);

///// vanillaBurst App
window.renderComplete = "false";

////CONTENT POLICY
///
window.frozenVanilla("nonce", function () {
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let length = 16; // Set this to the desired length of your nonce string
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
});

window.frozenVanilla("nonceBack", function () {
  let metaTag = document.querySelector(
    'meta[http-equiv="Content-Security-Policy"]'
  );
  if (metaTag) {
    const csp = metaTag.content;
    const existingNonce = csp.match(/'nonce-(.*?)'/)[1];
    return existingNonce;
  }

  let nonceString = window.nonce();
  let csp = document.createElement("meta");
  csp.httpEquiv = "Content-Security-Policy";
  csp.content = ` style-src ${domainUrl}  'nonce-${nonceString}'; script-src ${domainUrl} 'nonce-${nonceString}';`;
  document.head.appendChild(csp);

  // Set the nonce on the script and link tags
  let scriptTag = document.querySelector("script#vanillaBurstTag");
  if (scriptTag) {
    scriptTag.nonce = nonceString;
  }
  let linkTag = document.querySelector('link[name="appShellCSS"]');
  if (linkTag) {
    linkTag.nonce = nonceString;
  }
});

window.nonceBack();

window.frozenVanilla("setTrustedSources", function (sources) {
  // Define CSP if it's not already defined
  window.CSP = window.CSP || {};

  // Find the CSP meta tag
  let metaTag = document.querySelector(
    'meta[http-equiv="Content-Security-Policy"]'
  );

  // If the meta tag exists, parse its content and merge it with window.CSP
  if (metaTag) {
    let existingDirectives = metaTag.getAttribute("content").split(";");
    existingDirectives.forEach((directive) => {
      let [key, ...values] = directive.trim().split(" ");
      if (key) {
        window.CSP[key] = window.CSP[key] || [];
        window.CSP[key] = [...new Set([...window.CSP[key], ...values])];
      }
    });
  }

  // Iterate over each key in the sources object
  for (let directive in sources) {
    // Check if the directive exists in CSP
    if (window.CSP[directive]) {
      // If it exists, merge the trusted sources
      window.CSP[directive] = [
        ...new Set([...window.CSP[directive], ...sources[directive]]),
      ];
    } else {
      // If it doesn't exist, create it and assign the trusted sources to it
      window.CSP[directive] = sources[directive];
    }
  }

  // If the meta tag doesn't exist, create it
  if (!metaTag) {
    metaTag = document.createElement("meta");
    metaTag.setAttribute("http-equiv", "Content-Security-Policy");
    document.head.appendChild(metaTag);
  }

  // Build the CSP string
  let cspString = "";
  for (let directive in window.CSP) {
    cspString += `${directive} ${window.CSP[directive].join(" ")}; `;
  }

  // Update the CSP meta tag
  metaTag.setAttribute("content", cspString.trim());
});

////////

const start = async function (baseUrl) {
  let nonceString = window.nonceBack();
  if (typeof baseUrl !== "string") {
    throw new Error("Invalid baseUrl");
  }
  try {
    // Create a new script element

    const script = document.createElement("script");
    const scriptPath = baseUrl + "vanillaBurstScripts/vanillaApp.js";
    script.src = scriptPath;
    script.setAttribute("name", "init");
    script.setAttribute("nonce", nonceString);

    // Add the script to the document (this starts the loading process)
    document.head.appendChild(script);

    // Wait for the script to load
    await new Promise((resolve, reject) => {
      script.onload = (nonceString) => {
        resolve(script);
      };
      script.onerror = () => {
        const error = new Error(`Failed to load script: ${scriptPath}`);
        console.table({
          "Error Name": error.name,
          "Error Message": error.message,
          "Script Path": scriptPath,
        });
        reject(error);
      };
    });

    if (!window.frozenVanilla || typeof window.frozenVanilla !== "function") {
      throw new Error("window.frozenVanilla is not a function");
    }
    //window.vanillaApp(domainUrl, baseUrl);
  } catch (error) {
    throw error;
  }
};

try {
  start(baseUrl);
} catch (error) {
  console.error(error);
}
