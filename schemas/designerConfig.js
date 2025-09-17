ë.frozenVanilla("designerConfig", function () {
  let seo = {
    title: "vanilla JS Framework",
    description:
      "Meet vanillaBurst! An easy-to-use JavaScript framework, designed to bridge the gap between business logic and technical implementation",
    keywords: [
      "vanillaBurst",
      "JavaScript",
      "Plugin",
      "Standalone",
      "Project Builder",
      "Server Interaction",
      "State Caching",
      "Load Balancing",
    ],
    author: "vanillaBurst Team",
    image: ë.baseUrlImages + "wordmark.png", // Replace with the actual URL of the image
    url: ë.domainUrl + ë.stateTagPath, // Replace with the actual URL of the page, currently out of scope, will fix!
    siteName: "vanillaBurst",
  };
  //ë.setSeo(seo);
  let designerConfig = {
    designer: {
      role: "parent",
      fetchDOM: true,
      render: "pause",
      ...{ seo: seo },
      originBurst: {},
      container: "viewbox",
      components: {
        fetchComponents: {
          mynav: {
            data: [
              {
                id: "mainNav",
                namespace: "designer",
                container: "navigation-container",
                text: "Jump to Docs",
                route: "documentation",
              },
            ],
          },
          heroHeader: {
            data: [
              {
                id: "heroHeader-component",
                namespace: "designer",
                container: "heroHeader-component",
                refresh: true,
                ...{ seo: seo },
              },
            ],
          },
          actionButton: {
            data: [
              {
                id: "docbutton",
                namespace: "designer",
                container: "header-button",
                text: "View Documentation",
                classNames: "headerbutton mydocbutton",
                route: "documentation",
              },
              {
                id: "body-actionButton-component",
                namespace: "designer",
                container: "body-button",
                classNames: "headerbutton mydocbutton",
                text: "Jump to Docs",
                route: "documentation",
              },
            ],
          },
        },
      },
    },
    dependencies: [
      "core", // Core utilities (ID generation, validation)
      "designerSchema", // Central data structure (uiSchema)
      "modal", // Naming enforcement modal
      "storage", // IndexedDB + localStorage persistence
      "renderer", // DOM rendering from schema
      "layers", // Structural logic (containers, creation)
      "tools", // Tool layer for shape, text, etc.
      "inspector", // Inspector UI with live editing
      "main", // Application bootstrap, view creation, UI bindings
    ],
    // main: {
    //   role: "function",
    //   dir: "parent",
    //   functionFile: "imageSocket",
    //   render: "pause",
    //   originBurst: {
    //     namespace: "",
    //   },
    // },
    // storage: {
    //   role: "storage",
    //   dir: "parent",
    //   functionFile: "storage",
    //   render: "pause",
    //   originBurst: {
    //     namespace: "",
    //   },
    // },
    //...sharedParts,
  };

  return (designerConfig = { ...vanillaConfig("designer", designerConfig) });
});
