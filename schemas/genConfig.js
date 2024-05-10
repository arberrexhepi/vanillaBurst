window.frozenVanilla("genConfig", function (sharedParts) {
  let genConfig = {};

  let passedConfig = {
    gen: {
      role: "parent",
      dir: "client/views/gen/",
      functionFile: "gen",
      render: "pause",
      originBurst: "gen",
      htmlPath: "client/views/gen/gen.html",
      cssPath: "client/views/gen/gen.css",
      container: "viewbox",

      components: {
        myButtonName: {
          dir: "buttons/",
          id: "docbutton",
          container: "doc-button_wrapper",
          className: "button round",
          children: `
          <button class="mydocbutton" data-route="gen">View Documentation</button>
            `,
          eventHandlers: "submit:preventDefault",
        },

        parentnode: {
          parent: true,
          id: "parentnode",
          container: "config-canvas",
          className: "parentnode genform",
          children: `
              <div id="yo"><input type='text' name='functionName' placeholder='Function Name' />
              <textarea name='functionBody' placeholder='Function Body'></textarea>
              <input type='submit' value='Create Function' /></div>
            `,
          eventHandlers: "submit:preventDefault",
        },

        functionnode: {
          parent: true,
          id: "functionnode",
          container: "config-canvas",
          className: "viewnode",
          children: `
              <div id="yo"> say hello </div>
          `,
        },
      },
    },
    ...sharedParts,
  };

  genConfig = { ...vanillaConfig("gen", passedConfig) };

  return genConfig;
});
