ë.frozenVanilla("homeviewConfig", function (sharedParts) {
  let homeviewConfig = {};
  let seo = {
    title: "vanilla JS Framework",
    description:
      "Meet vanillaBurst! Simplify your JS webApp projects, manage functions, DOM, and server interactions with ease.",
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
    url: domainUrl + ë.stateTagPath, // Replace with the actual URL of the page, currently out of scope, will fix!
    siteName: "vanillaBurst",
  };

  let passedConfig = {
    homeview: {
      role: "parent",
      dir: "client/views/homeview/",
      functionFile: "homeview",
      render: "pause",
      originBurst: {},
      htmlPath: "client/views/homeview/homeview.html",
      cssPath: "client/views/homeview/homeview.css",
      cssPack: [""],
      container: "viewbox",
      components: {},
      ...{ seo: seo },
    },

    ...sharedParts,
  };

  homeviewConfig = { ...vanillaConfig("homeview", passedConfig) };

  ë.seo = seo;

  return homeviewConfig;
});
