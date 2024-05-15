window.frozenVanilla("heroHeaderConfig", function () {
  let heroHeaderConfig = {
    heroHeader: {
      dir: "client/views/shared/heroHeader/",
      functionFile: "heroHeader",
      render: "pause",
      htmlPath: "client/views/shared/heroHeader/heroHeader.html",
      cssPath: "client/views/shared/heroHeader/heroHeader.css",
      container: "myHeroHeader",
      originBurst: {
        namespace: null,
      },
      components: {
        docButtonHeader: {
          namespace: ["homeview", "gen"],
          dir: "buttons/",
          id: "docbutton",
          container: "action-container",
          className: "button round",
          children: `
            <div class="button_wrapper">
            <button class="headerbutton mydocbutton" data-route="documentation">View Documentation</button></div>
            <br />
            <p>Explore the power and flexibility of vanillaBurst. Dive into our comprehensive documentation to learn how to
              use vanillaBurst, understand its core concepts, and much more.</p>
            `,
          eventHandlers: "submit:preventDefault",
        },
        genButtonHeader: {
          namespace: ["documentation"],
          dir: "buttons/",
          id: "genbutton",
          container: "action-container",
          className: "button round",
          children: `
          <div class="button_wrapper">
              <button class="headerbutton mygenbutton" data-route="gen">Go to Config Builder</button></div>
              <br />
              <p>Explore the power and flexibility of vanillaBurst. Get started quickly by generating configs with the config builder!</p>
            `,
          eventHandlers: "submit:preventDefault",
        },
      },
    },
  };

  return heroHeaderConfig;
});
