const mode = "live"; // "dev" or "live"

// Define base URLs for different modes
const baseUrls = {
  dev: "/",
  live: "/",
};

// Define and freeze the frozenVanilla utility
function defineFrozenVanilla() {
  if (typeof window.frozenVanilla === "undefined") {
    Object.defineProperty(window, "frozenVanilla", {
      value: function frozenVanilla(prop, value, setAsWindowProp = true) {
        const frozenValue =
          typeof value === "function"
            ? Object.freeze(value.bind(this))
            : Object.freeze(value);

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

const domainUrl = `${window.location.origin}/`;

// Freeze the isFrozen checker
window.frozenVanilla("isFrozen", isFrozen);

// Set base URL based on mode
const baseUrl = baseUrls[mode] || baseUrls.dev;
window.frozenVanilla("mode", mode);
window.frozenVanilla("baseUrl", baseUrl);

// Set renderComplete flag
window.renderComplete = "false";

// Generate a nonce
window.frozenVanilla("nonce", () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 16;
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
});

// Retrieve or create a nonce
window.frozenVanilla("nonceBack", () => {
  let metaTag = document.querySelector(
    'meta[http-equiv="Content-Security-Policy"]'
  );
  if (metaTag) {
    return metaTag.content.match(/'nonce-(.*?)'/)[1];
  }

  const nonceString = window.nonce();
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

// Set trusted CSP sources
window.frozenVanilla("setTrustedSources", (sources) => {
  const cspMetaTag =
    document.querySelector('meta[http-equiv="Content-Security-Policy"]') ||
    document.createElement("meta");
  const existingDirectives =
    cspMetaTag.getAttribute("content")?.split(";") || [];
  const newCSP = existingDirectives.reduce((csp, directive) => {
    const [key, ...values] = directive.trim().split(" ");
    if (key) {
      csp[key] = [...new Set((csp[key] || []).concat(values))];
    }
    return csp;
  }, {});

  Object.keys(sources).forEach((key) => {
    newCSP[key] = [...new Set((newCSP[key] || []).concat(sources[key]))];
  });

  const cspString = Object.keys(newCSP)
    .map((key) => `${key} ${newCSP[key].join(" ")}`)
    .join("; ");
  if (!cspMetaTag.isConnected) {
    cspMetaTag.setAttribute("http-equiv", "Content-Security-Policy");
    document.head.appendChild(cspMetaTag);
  }
  cspMetaTag.setAttribute("content", cspString);
});

// Start the application
const start = async (baseUrl) => {
  //window.logSpacer();

  const nonceString = window.nonceBack();
  if (typeof baseUrl !== "string") {
    throw new Error("Invalid baseUrl");
  }

  // Load the main app script
  const loadAppScript = async () => {
    const scriptPath = `${baseUrl}vanillaBurstScripts/vanillaApp.js`;
    const script = document.createElement("script");
    script.src = scriptPath;
    script.setAttribute("name", "init");
    script.setAttribute("nonce", nonceString);
    document.head.appendChild(script);

    return new Promise((resolve, reject) => {
      script.onload = () => resolve(script);
      script.onerror = () =>
        reject(new Error(`Failed to load script: ${scriptPath}`));
    });
  };

  try {
    await loadAppScript();
    if (typeof window.frozenVanilla !== "function") {
      throw new Error("window.frozenVanilla is not a function");
    }
  } catch (error) {
    console.error(error);
  }
};

window.frozenVanilla("logSpacer", function () {
  console.log(".");
  console.log(".");
  console.log(".");
});

// Trigger the start function
start(baseUrl).catch((error) => console.error(error));
