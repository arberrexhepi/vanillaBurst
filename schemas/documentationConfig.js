window.frozenVanilla("documentationConfig", function (sharedParts) {
  let documentationConfig = {};

  let passedConfig = {
    documentation: {
      role: "parent",
      dir: "client/views/documentation/",
      functionFile: "documentation",
      render: "pause",
      originBurst: "documentation",
      htmlPath: "client/views/documentation/documentation.html",
      cssPath: "client/views/documentation/documentation.css",
      container: "viewbox",
      components: {
        myButtonName: {
          dir: "buttons/",
          id: "genbutton",
          container: "gen-button_wrapper",
          className: "button round",
          children: `
          <button class="headerbutton mygenbutton" data-route="gen">Go to the Config Builder</button>
            `,
          eventHandlers: "submit:preventDefault",
        },
      },
      ...sharedParts,
    },
  };

  documentationConfig = { ...vanillaConfig("documentation", passedConfig) };

  return documentationConfig;
});
