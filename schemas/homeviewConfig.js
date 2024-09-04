ë.frozenVanilla("homeviewConfig", function () {
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

  let homeviewConfig = {
    homeview: {
      role: "parent",
      fetchDOM: true,
      render: "pause",
      originBurst: {},
      container: "viewbox",
      ...{ seo: seo },
      components: {
        fetchComponents: {
          mynav: {
            data: [
              {
                id: "mainNav",
                namespace: "homeview",
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
                namespace: "homeview",
                container: "heroHeader-component",
              },
            ],
          },
          actionButton: {
            data: [
              {
                id: "docbutton",
                namespace: "homeview",
                container: "header-button",
                text: "View Documentation",
                classNames: "headerbutton mydocbutton",
                route: "documentation",
              },
              {
                id: "body-actionButton-component",
                namespace: "homeview",
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

    //...sharedParts,
  };

  return (homeviewConfig = { ...vanillaConfig("homeview", homeviewConfig) });
});
