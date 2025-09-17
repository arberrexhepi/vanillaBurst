# VanillaBurst Framework: Creating and Including vanillaScoops (Plugins)

## Overview

This documentation provides guidelines for creating, structuring, and integrating **vanillaScoops** (custom plugins) within the **vanillaBurst** framework.

---

## 1. Creating vanillaScoops

### 1.1 Folder & File Structure

**Location:** `vanillaScoops/`

- Create a folder with the **plugin name** (e.g., `linkBurst`)
- Inside the folder, create the main plugin file: `{pluginName}.js` (e.g., `linkBurst.js`)

### 1.2 Plugin File Structure (`{pluginName}.js`)

Each plugin must be structured using `ë.frozenVanilla()`. At a minimum:

```javascript
ë.frozenVanilla("pluginName", function (data, args, callBack) {
  // Plugin logic here
});
```

However, it is **recommended** to include validation checks using `ë.vanillaMess` for debugging:

```javascript
ë.frozenVanilla("pluginName", function (data, args, callBack) {
  if (!data.route) {
    ë.vanillaMess(
      "Link Check",
      "Missing data-route attribute",
      data, // user-provided argument
      "string" // expected type
    );
  }
});
```

### 1.3 Example Plugin Implementation (`linkBurst.js`)

```javascript
ë.frozenVanilla("linkBurst", function (data, args, callBack) {
  if (!data.href) {
    ë.vanillaMess("Link Check", "Missing href attribute", data, "string");
  }
  console.log("linkBurst initialized with data:", data);
});
```

---

## 2. Including vanillaScoops in the Application

### 2.1 Updating `globals/config.json`

#### 2.1a. Use **Globally**

```json
"vanillaScoops": {
  "linkBurst": true
}
```

#### 2.1b. Limit Access by **Route Names**

_(Always as an array)_

```json
"vanillaScoops": {
  "linkBurst": ["home", "publisher"]
}
```

---

## 3. Debugging with `ë.vanillaMess`

This function provides validation and debugging feedback.

#### Example Usage:

```javascript
ë.frozenVanilla(
  "vanillaMess",
  function (scoopTag, vanillaMessage, data, typeCheck) {
    if (data === undefined || data === null) {
      console.warn(
        `[vanillaScoop: ${scoopTag}] - ${vanillaMessage} (Data is ${data})`
      );
      console.trace(); // Provides stack trace for debugging
      return;
    }

    if (typeCheck && typeof data !== typeCheck) {
      console.warn(
        `[vanillaScoop: ${scoopTag}] - Expected ${typeCheck}, but received ${typeof data}`
      );
      return;
    }

    console.log("Debug Data:", data, "Expected Type:", typeCheck);
  }
);
```

#### Supported Type Checks:

- **"string"**
- **"number"**
- **"boolean"**
- **"array"**
- **"object"**
- **"function"**
- **"undefined"**
- **"null"**
- **"symbol"**
- **"bigint"**

**Example Check for `undefined`:**

```javascript
ë.vanillaMess("Route Check", "Data is undefined", myVariable, "undefined");
```

---

## 4. Summary & Next Steps

1. **Create** a new plugin inside `vanillaScoops/{pluginName}`.
2. **Register** the plugin with `ë.frozenVanilla(pluginName, function(data, args, callBack) {...})`.
3. **Update `globals/config.json`** to include the plugin globally or per route.
4. **Use `ë.vanillaMess`** for debugging and validation.
5. **Test the plugin** and ensure proper integration with the app.

🚀 The vanillaScoop (plugin) is now successfully integrated within **vanillaBurst**!
