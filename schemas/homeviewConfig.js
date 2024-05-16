window.frozenVanilla("homeviewConfig", function (sharedParts) {
  let homeviewConfig = {};

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
      components: {
        myButtonName: {
          dir: "buttons/",
          id: "docbutton",
          container: "doc-button_wrapper",
          children: `
          <button class="headerbutton mydocbutton button round" data-route="documentation">View Documentation</button>
            `,
          eventHandlers: "submit:preventDefault",
        },
      },
    },
    ...sharedParts,
  };

  homeviewConfig = { ...vanillaConfig("homeview", passedConfig) };

  return homeviewConfig;
});
