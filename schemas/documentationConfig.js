ë.frozenVanilla("documentationConfig", function () {
  let seo = {
    title: "vanillaBurst Documentation",
    description:
      "Dive into vanillaBurst's Comprehensive docs and get started with quick app creation. Your next project is waiting!",
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
  ë.setSeo(seo);
  let documentationConfig = {
    documentation: {
      role: "parent",
      fetchDOM: true,
      render: "pause",
      originBurst: "documentation",
      container: "viewbox",
      // seo: seo,
      components: {
        fetchComponents: {
          mynav: {
            data: [
              {
                id: "mainNav",
                namespace: "documentation",
                container: "navigation-container",
                text: "Generate Configs",
                route: "generate",
              },
            ],
          },
          heroHeader: {
            data: [
              {
                id: "heroHeader-component",
                namespace: "documentation",
                container: "heroHeader-component",
                refresh: true,
              },
            ],
          },
          actionButton: {
            data: [
              {
                id: "docbutton",
                namespace: "documentation",
                container: "header-button",
                text: "Generate Configs",
                classNames: "headerbutton mygenbutton",
                route: "generate",
              },
              {
                id: "body-actionButton-component",
                namespace: "documentation",
                container: "body-button",
                classNames: "headerbutton mygenbutton",
                text: "Generate Configs",
                route: "generate",
              },
            ],
          },
        },
      },
      ...{ seo: seo },
    },
  };

  return (documentationConfig = {
    ...vanillaConfig("documentation", documentationConfig),
  });
});
