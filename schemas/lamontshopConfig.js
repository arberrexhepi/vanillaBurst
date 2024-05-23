window.frozenVanilla("lamontshopConfig", function (sharedParts) {
  let seo = {
    title: "Generate  App Views",
    description:
      "vanillaBurst assists with planning and creation of your app's views. Streamline your JS projects with ease and efficiency.",
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
    image: "URL to the image for social sharing", // Replace with the actual URL of the image
    url: "URL of the page", // Replace with the actual URL of the page
    siteName: "vanillaBurst",
  };

  let lamontshopConfig = {};
  let passedConfig = {
    lamontshop: {
      role: "parent",
      dir: "client/views/lamontshop/",
      functionFile: "lamontshop",
      render: "pause",
      htmlPath: "client/views/lamontshop/lamontshop.html",
      cssPath: "client/views/lamontshop/lamontshop.css",
      container: "viewbox",
      ...{ seo: seo },
      originBurst: {},
    },
    ...sharedParts,
  };

  lamontshopConfig = { ...vanillaConfig("lamontshop", passedConfig) };
  window.seo = seo;

  return lamontshopConfig;
});
