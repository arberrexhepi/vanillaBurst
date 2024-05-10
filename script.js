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

window.frozenVanilla("baseUrl", baseUrl);

///// vanillaBurst App
window.renderComplete = "false";

////

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
  csp.content = `default-src 'self'; style-src 'self' 'nonce-${nonceString}'; script-src 'self' 'nonce-${nonceString}';`;
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
