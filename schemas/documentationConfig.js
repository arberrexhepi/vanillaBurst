window.frozenVanilla("documentationConfig", function (sharedParts) {
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
    image: "URL to the image for social sharing", // Replace with the actual URL of the image
    url: "URL of the page", // Replace with the actual URL of the page
    siteName: "vanillaBurst",
  };

  let passedConfig = {
    documentation: {
      role: "parent",
      dir: "client/views/documentation/",
      functionFile: "documentation",
      render: "pause",
      originBurst: "documentation",
      htmlPath: "client/views/documentation/documentation.html",
      cssPath: "client/views/documentation/documentation.css",
      ...{ seo: seo },
      container: "viewbox",
      // components: {
      //   myButtonName: {
      //     dir: "buttons/",
      //     id: "genbutton",
      //     container: "gen-button_wrapper",
      //     className: "button round",
      //     children: `
      //     <button class="headerbutton mygenbutton" data-route="gen">Go to the Config Builder</button>
      //       `,
      //     eventHandlers: "submit:preventDefault",
      //   },
      // },
    },
    ...sharedParts,
  };

  documentationConfig = { ...vanillaConfig("documentation", passedConfig) };

  window.seo = seo;

  return documentationConfig;
});
