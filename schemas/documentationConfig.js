ë.frozenVanilla("documentationConfig", function (sharedParts) {
  let documentationConfig = {};

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

  let passedConfig = {
    documentation: {
      role: "parent",
      fetchDOM: true,
      render: "pause",
      originBurst: "documentation",

      ...{ seo: seo },
      container: "viewbox",
    },
    ...sharedParts,
  };

  documentationConfig = { ...vanillaConfig("documentation", passedConfig) };

  ë.seo = seo;

  return documentationConfig;
});
