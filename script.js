// set app mode variables "dev" or "live"

const mode = "live";
const versions = { dev: "0.0.07", live: "0.0.07" };

// Define base URLs for different mode
const domainUrls = {
  dev: "http://vanillaburstgame",
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
    "Oops, looks like we dropped your vanilla , we'll try preparing it again!", error
  ); 
   window.location.reload();
  }

// Function to check if a window property is frozen and of the correct type
const isFrozen = (prop, type) => typeof window[prop] !== "undefined" && Object.isFrozen(window[prop]) && typeof window[prop] === type;
// Freeze the isFrozen checker
window.frozenVanilla("isFrozen", isFrozen);

/////// Start the application////////////
start(fullPath).catch((error) => console.error(error));
