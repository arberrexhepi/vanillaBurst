# VanillaBurst Framework: Modals Component Implementation

## Overview

This documentation provides a step-by-step guide to integrating **modals** as a component within the **vanillaBurst** framework. It details the configuration, file structure, component setup, and necessary additions to the global configuration.

---

## 1. Configuration File Setup

### Location:

The modal configuration is defined using `ë.frozenVanilla()` and should be placed where **component initialization** occurs.

### Example Configuration:

```javascript
ë.frozenVanilla("modalsConfig", function (burstTo) {
  let modalsConfig = {
    modals: {
      role: "component",
      render: "pause",
      fetchDOM: true,
      container: "modalsbuttons",
      originBurst: {
        createModalHTML: `
          <div id="project-modal" class="modal">
            <div class="modal-content">
              <span class="close-button" id="close-modal">&times;</span>
              <h2>Create a New Project</h2>
              <label for="project-name">Enter Project Name:</label>
              <input type="text" id="project-name" name="project-name" required>
              <input type="button" id="create-project-button">
              <label for="create-project-button" class="selected-label button-label">Create</label>
              <div class="validation"></div>
            </div>
          </div>
        `,
        selectProjectsModalHTML: `
          <div id="select-projects-modal" class="modal">
            <div class="modal-content">
              <span class="close-button" id="close-select-modal">&times;</span>
              <h2>Enhanced Projects</h2>
              <div id="projects-list"></div>
              <div class="validation"></div>
            </div>
          </div>
        `,
        loginHTML: `
          <span class="close-button" id="close-select-modal">&times;</span>
          <h2>Login to Access Your Projects</h2>
          <input type="button" id="modal-login-button" value="get_project">
          <label for="modal-login-button" class="selected-label button-label">
            <a href="${ë.domainUrl}/login">Login</a>
          </label>
        `,
      },
      components: {
        fetchComponents: {
          modals: {},
        },
      },
    },
  };
  return modalsConfig;
});
```

**Notes:**

- `originBurst` contains **optional** predefined HTML structures that can be dynamically utilized.
- `fetchComponents` indicates subcomponents to be fetched dynamically.

---

## 2. Component File Structure

**Location:** `client/components/modals/`

### Required Files:

1. **`modals.js`** (Component Registration)
2. **`modalsComponent.js`** (Component Implementation - Required if using `fetchComponents`)
3. **`modals.css`** (Component Styles)
4. **`modals.html`** (Optional, legacy support)

---

## 3. Component Files Implementation

### 3.1 Component Registration (`modals.js`)

```javascript
ë.frozenVanilla("modals", function (vanillaPromise) {
  // Component registration logic
});
```

### 3.2 Component Definition (`modalsComponent.js`)

```javascript
ë.frozenVanilla("modalsComponent", async function (data) {
  let modalsComponent = {
    [`modals`]: {
      namespace: ["journey"],
      container: `modalsbuttons`,
      classNames: "",
      children: ``,
    },
  };

  return modalsComponent;
});
```

### 3.3 Component Styles (`modals.css`)

```css
.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  background-color: white;
  border-radius: 5px;
  padding: 20px;
}
.modal-content {
  position: relative;
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
```

### 3.4 Optional Component HTML (`modals.html`)

**(Only required for legacy support)**

```html
<div id="modal-container"></div>
```

---

## 4. Configuration Updates

### 4.1 Add Component to `globals/config.js`

#### In `schemaParts`:

```json
"schemaParts": {
  "component/modals": []
}
```

#### In `packages`:

```json
"packages": {
  "appShells": ["postStats", "ledgerTabs"],
  "ledgerBoard": ["ledgerFunc", "modalsPack"],
  "publisherPackage": ["agentBuilder"],
  "imageGen": ["logoFunc", "generatecolor"],
  "modalsPack": ["modals"]
}
```

#### In Function Configurations:

```json
"schemaParts": {
  "journey": ["appShells", "imageGen", "modalsPack"],
  "publisher": ["appShells", "ledgerBoard", "publisherPackage"]
}
```

---

## 5. Summary & Next Steps

1. **Ensure `modalsConfig` is properly defined** within `ë.frozenVanilla()`.
2. **Create the component files** in `client/components/modals/`.
3. **Register the component** in `modals.js`.
4. **Define the component’s behavior** in `modalsComponent.js`.
5. **Style the component** in `modals.css`.
6. **Update `globals/config.js`** to integrate the component.

The component is now ready for use within the **vanillaBurst** framework! 🚀
