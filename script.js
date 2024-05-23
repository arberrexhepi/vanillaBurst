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
  if (!window.seo) {
    window.seo = {};
  }
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

//set seo to head tag
window.frozenVanilla("setSeo", function (seo) {
  if (seo) {
    // Set window.seo to the incoming seo object

    // Define the meta tags to be set
    const metaTags = {
      description: seo.description || "",
      keywords: seo.keywords ? seo.keywords.join(", ") : "",
      author: seo.author || "",
      "og:image": seo.image || "",
      "og:url": seo.url || "",
      "og:site_name": seo.siteName || "",
    };

    // Set the title of the document
    if (seo.title) {
      document.title = seo.title;
      console.log("Document title set to:", seo.title);
    }

    // Iterate over the metaTags object
    for (const [name, content] of Object.entries(metaTags)) {
      // Find an existing meta tag
      let metaTag = document.querySelector(
        `meta[name="${name}"], meta[property="${name}"]`
      );

      // If the meta tag doesn't exist, create it
      if (!metaTag) {
        metaTag = document.createElement("meta");
        if (name.startsWith("og:")) {
          metaTag.setAttribute("property", name);
        } else {
          metaTag.setAttribute("name", name);
        }
        document.head.appendChild(metaTag);
      }

      // Set the content of the meta tag
      metaTag.setAttribute("content", content);

      // Log the updated or created meta tag
      console.log(`Meta tag set: ${name} = ${content}`);
    }
  }
});

window.frozenVanilla("logSpacer", function () {
  console.log(".");
  console.log(".");
  console.log(".");
});

// Trigger the start function
start(baseUrl).catch((error) => console.error(error));
