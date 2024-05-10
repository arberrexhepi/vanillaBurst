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
          <button class="mydocbutton button round" data-route="gen">Generate Configs</button>
            `,
          eventHandlers: "submit:preventDefault",
        },
        // myNav: {
        //   dir: "nav/",
        //   id: "vanillaNav",
        //   container: "mainNav",
        //   children: `
        //   <nav id="mainNav-content">
        //     <ul>
        //       <li><span class="nav-link" data-route="homeview">Home</span></li>
        //       <li><span class="nav-link" data-route="documentation">Docs</span></li>
        //       <li><span class="nav-link" data-route="gen">Generate</span></li>
        //       </ul>
        //     </nav>
        //     `,
        //   eventHandlers: "submit:preventDefault",
        // },
      },
    },
    ...sharedParts,
  };

  homeviewConfig = { ...vanillaConfig("homeview", passedConfig) };

  return homeviewConfig;
});
