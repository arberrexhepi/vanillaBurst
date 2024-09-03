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
      components: {},
    },

    //...sharedParts,
  };

  return (homeviewConfig = { ...vanillaConfig("homeview", homeviewConfig) });
});
