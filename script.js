const mode = "dev"; // "dev" or "live"
const version = "0.9.0.2";
// Define base URLs for different modes
const baseUrls = {
  dev: "/",
  live: "/",
};

const errorLogs = true;

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

const domainUrl = `${window.location.origin}/`;

// Freeze the isFrozen checker
window.frozenVanilla("isFrozen", isFrozen);

////////////IDENTIFIER SET/////////////////

const ë = window;

////////////IDENTIFIER SET/////////////////

// Set base URL based on mode
const baseUrl = baseUrls[mode] || baseUrls.dev;
ë.frozenVanilla("mode", mode);
ë.frozenVanilla("baseUrl", baseUrl);
ë.frozenVanilla("version", version);

// Set renderComplete flag
ë.renderComplete = "false";

// Generate a nonce
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

// Set trusted CSP sources
ë.frozenVanilla("setTrustedSources", (sources) => {
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
  if (!ë.seo) {
    ë.seo = {};
  }
  //ë.logSpacer();

  const nonceString = ë.nonceBack();
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
    if (typeof ë.frozenVanilla !== "function") {
      throw new Error("ë.frozenVanilla is not a function");
    }
  } catch (error) {
    console.error(error);
  }
};

//set seo to head tag
ë.frozenVanilla("setSeo", function (seo) {
  if (seo) {
    // Set ë.seo to the incoming seo object

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

ë.frozenVanilla("logSpacer", function () {
  console.log(".");
  console.log(".");
  console.log(".");
});

//as in vanillaMessage..!
ë.frozenVanilla("vanillaMess", function (vanillaMessage, data, typeCheck) {
  if (ë.vanillaStock !== true) {
    new Error().stack;
    return;
  }
  let vanillaTableMess = {
    myMessage: vanillaMessage,
    expectingType: typeCheck,
    message: "",
    data: data,
    stack: null,
  };
  // if (!data) {
  //   vanillaTableMess.myMessage = data;

  //   return console.log("Data is undefined, 0, or false");
  // }

  if (
    (data && data !== null) ||
    (data && data !== null && typeCheck && typeCheck !== null)
  ) {
    try {
      if (typeCheck === "check") {
        if (data instanceof Text) {
          vanillaTableMess.message += "Instance of Text";
        }
        vanillaTableMess.message +=
          "The data has returned:" + JSON.stringify(data);
        vanillaTableMess.message += "Data type: " + typeof data;
        vanillaTableMess.stack = new Error().stack;
      }
      if (typeCheck === "array" || typeCheck === "array") {
        if (Array.isArray(data)) {
          vanillaTableMess.message += "Data is array: " + data;
          vanillaTableMess.data = JSON.stringify(data);
        } else {
          vanillaTableMess.message += "Data is not an array: ";
          vanillaTableMess.stack = new Error().stack;
        }
      }

      if (typeCheck === "object" || typeCheck === "array") {
        if (typeof data === "object" && data !== null && !Array.isArray(data)) {
          if (data instanceof Node) {
            vanillaTableMess.message += "Data is a DOM node";
          } else if (data instanceof Function) {
            vanillaTableMess.message += "Data is a function";
          } else if (data instanceof Date) {
            vanillaTableMess.message += "Data is a date";
          } else if (data instanceof RegExp) {
            vanillaTableMess.message += "Data is a regular expression";
          } else if (data instanceof Text) {
            vanillaTableMess.message += "Instance of Text";
          } else {
            vanillaTableMess.message += "Data is an object";
          }
          vanillaTableMess.data = data;
        } else {
          vanillaTableMess.message += "Data is not an object: ";
          vanillaTableMess.data = data;
        }
      }

      if (typeCheck === "string" || typeCheck === "array") {
        if (typeof data === "string") {
          vanillaTableMess.message += "String is a string";
        } else {
          vanillaTableMess.message += "Data is not a string: ";
        }
      }

      if (typeCheck === "number" || typeCheck === "array") {
        if (typeof data === "number" || data === 0) {
          vanillaTableMess.message += "Number is Number: " + data;
        } else {
          vanillaTableMess.message += "Data is not a number: ";
        }
      }

      if (typeCheck === "boolean" || typeCheck === "array") {
        if (typeof data === "boolean") {
          vanillaTableMess.message += "Boolean: " + true;
          vanillaTableMess.data = data;
        } else {
          vanillaTableMess.message += "Boolean: " + false;
        }
      }

      if (typeCheck === "function" || typeCheck === "array") {
        if (typeof data === "function") {
          vanillaTableMess.message += "Function is Function: " + data.name;
        } else {
          vanillaTableMess.message += "Data is not a function ";
        }
      }

      if (typeCheck === "undefined" || typeCheck === "array") {
        if (typeof data === "undefined") {
          vanillaTableMess.message += "Data is indeed undefined";
        } else {
          vanillaTableMess.message +=
            "Data is not undefined, hope that's what you wanted to hear! ";
        }
      }

      if (typeCheck === "null" || typeCheck === "array") {
        if (data === null) {
          vanillaTableMess.message += "Data is null";
        } else {
          vanillaTableMess.message += "Data is not null";
        }
      }

      if (typeCheck === "symbol" || typeCheck === "array") {
        if (typeof data === "symbol") {
          return true;
        } else {
          vanillaTableMess.message += "Data is not a symbol";
        }
      }

      if (typeCheck === "bigint" || typeCheck === "array") {
        if (typeof data === "bigint") {
          vanillaTableMess.message += "Data is a bigint";
        } else {
          vanillaTableMess.message += "Data is not a bigint";
        }
      }
      //runError(false, vanillaTableMess.message, data, typeCheck);
    } catch (error) {
      runError(
        vanillaTableMess ||
          "[vanillaMess] Something went wrong with the checks",
        error
      );
      vanillaTableMess["error"] = error;
      //throw new Error(vanillaTableMess);
    }
  } else {
    runError(
      ((vanillaTableMess.message = "Data is either undefined, null, or 0"),
      new Error(vanillaTableMess)),
      data
    );
    //throw new Error(vanillaTableMess);
  }
  function runError(vanillaTableMess, data) {
    return vanillaTableMess;
  }

  while (true) {
    vanillaMessage.stack = new Error().stack;
    console.table(vanillaTableMess);
    return console.warn("Scoop Message (see table above)");
  }
});

// Trigger the start function
start(baseUrl).catch((error) => console.error(error));
