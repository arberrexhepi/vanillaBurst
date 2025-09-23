// set app mode variables "dev" or "live"

const mode = "live";
const versions = { dev: "0.0.08", live: "0.0.08" };

// Define base URLs for different mode
const domainUrls = {
  dev: "https://vanillaburstgame",
  live: "https://vanillaburst.com",
};
const baseUrls = {
  dev: "/",
  live: "/",
};

const systemLogs = true;
const localCacheMax = 10000; //5mb

// Define and freeze the frozenVanilla utility
function defineFrozenVanilla() {
  if (typeof window.frozenVanilla === "undefined") {
    const storage = {};

    Object.defineProperty(window, "frozenVanilla", {
      value: function frozenVanilla(prop, value, setAsWindowProp = true) {
        const frozenValue =
          typeof value === "function"
            ? Object.freeze(value.bind(this))
            : Object.freeze(value);

        // Store the frozen value
        storage[prop] = frozenValue;

        if (
          setAsWindowProp &&
          (typeof window[prop] === "undefined" ||
            Object.getOwnPropertyDescriptor(window, prop).writable)
        ) {
          Object.defineProperty(window, prop, {
            value: frozenValue,
            writable: false,
            configurable: false,
          });
        }
        return frozenValue;
      },
      writable: false,
      configurable: false,
    });

    // Add a method to get values from the storage
    window.frozenVanilla.get = function (prop) {
      return storage[prop];
    };
  }
}

try {
  defineFrozenVanilla();
} catch (error) {
  console.error(
    "Oops, looks like we dropped your vanilla, we'll try preparing it again!",
    error
  );
  window.location.reload();
}

// Function to check if a window property is frozen and of the correct type
const isFrozen = (prop, type) =>
  typeof window[prop] !== "undefined" &&
  Object.isFrozen(window[prop]) &&
  typeof window[prop] === type;

// Freeze the isFrozen checker
window.frozenVanilla("isFrozen", isFrozen);

////////////IDENTIFIER SET/////////////////

const ë = window;

////////////IDENTIFIER SET/////////////////

/////////// Set base URL based on mode/////
//const domainUrl = `${window.location.origin}/`;

const domainUrl = domainUrls[mode] || domainUrls.dev;

const baseUrl = baseUrls[mode] || baseUrls.dev;
const version = versions[mode] || versions.dev;

ë.frozenVanilla("domainUrl", domainUrl);

ë.frozenVanilla("mode", mode);
ë.frozenVanilla("baseUrl", baseUrl);
ë.frozenVanilla("version", version);
ë.frozenVanilla("fullPath", ë.domainUrl + ë.baseUrl);

// Set renderComplete flag
ë.renderComplete = "false";

////////////// Generate a nonce/////////////
ë.frozenVanilla("nonce", () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 16;
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
});

// Retrieve or create a nonce
ë.frozenVanilla("nonceBack", () => {
  let metaTag = document.querySelector(
    'meta[http-equiv="Content-Security-Policy"]'
  );
  if (metaTag) {
    return metaTag.content.match(/'nonce-(.*?)'/)[1];
  }

  const nonceString = ë.nonce();
  metaTag = document.createElement("meta");
  metaTag.httpEquiv = "Content-Security-Policy";
  metaTag.content = `style-src ${domainUrl} 'nonce-${nonceString}'; script-src ${domainUrl} 'nonce-${nonceString}';`;
  document.head.appendChild(metaTag);

  document
    .querySelectorAll("script#vanillaBurstTag, link[name='appShellCSS']")
    .forEach((tag) => {
      tag.nonce = nonceString;
    });

  return nonceString;
});
////////////// Start the application////////////
const start = async () => {
  const fullPath = ë.fullPath;

  if (typeof fullPath !== "string") {
    throw new Error("Invalid fullPath");
  }

  ë.frozenVanilla("loadScript", function loadScript(url) {
    return new Promise((resolve, reject) => {
      const version = ë.version;
      const urlWithVersion = `${url}?version=${version}`;
      console.log("trying script " + urlWithVersion);

      const existingScript = document.head.querySelector(
        `script[src="${urlWithVersion}"]`
      );
      if (existingScript) {
        let nonceString = ë.nonceBack(); // Generate a new nonce
        existingScript.setAttribute("nonce", nonceString); // Update the nonce of the existing script
        resolve(existingScript);
        return;
      }

      let script = document.createElement("script");
      script.src = urlWithVersion;
      script.type = "text/javascript";
      script.setAttribute("nonce", ë.nonceBack());

      script.onload = () => resolve(script);
      script.onerror = () => reject(new Error(`Script load error for ${url}`));
      document.head.appendChild(script);
    });
  });

  try {
    await ë.loadScript(
      `${fullPath}vanillaBurstScripts/system/security/setTrustedSources.js`
    );
    await ë.loadScript(
      `${fullPath}vanillaBurstScripts/system/logs/vanillaMess.js`
    );

    await ë.loadScript(`${fullPath}vanillaBurstScripts/system/web/setSeo.js`);

    await ë.loadScript(`${fullPath}vanillaBurstScripts/vanillaApp.js`);

    if (typeof ë.frozenVanilla !== "function") {
      throw new Error("ë.frozenVanilla is not a function");
    }
  } catch (error) {
    console.error(error);
  }
};

ë.frozenVanilla("logSpacer", function (message1, message2, css, singleSpace) {
  if (systemLogs) {
    let message = "";
    if (message1 && message1 !== null) {
      if (typeof message1 === "object") {
        message += JSON.stringify(message1);
      } else {
        message += message1;
      }
    }
    if (message2 && message2 !== null) {
      if (typeof message2 === "object") {
        message += JSON.stringify(message2);
      } else {
        message += message2;
      }
    }

    if (message && message !== null) {
      if (css) {
        console.log(message, css);
      } else {
        console.log(message);
      }
    }
    if (!singleSpace || singleSpace === null) {
      console.log(".");
      console.log(".");
      console.log(".");
    }
  }
});

//////// Trigger the start function/////////////
start(fullPath).catch((error) => console.error(error));
