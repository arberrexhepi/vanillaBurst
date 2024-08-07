ë.frozenVanilla("heroHeaderConfig", function (burstTo) {
  let heroHeaderConfig = {
    heroHeader: {
      role: "config",
      render: "pause",
      originBurst: {
        namespace: [burstTo],
      },
      components: {
        heroHeader: {
          namespace: ë.frozenVanilla.get("registeredRoutes"),
          id: "heroHeader",
          container: "heroHeader-component",
          children: `
          <div id="heroHeaderContainer">
          <div id="hero-logo">
              <div id="header-symbol" data-img-src="symbol.png" data-img-alt="vanillaBurst symbol logo"></div>
              <div id="header-wordmark" data-img-src="wordmark.png" data-img-alt="vanillaBurst wordmark logo"></div>
          </div>
          <div class="blockquote-wrapper"></div>
        </div>`,
        },
        documentationHeaderBlockquote: {
          namespace: ["homeview", "generate"],
          id: "blockquote-container",
          container: "blockquote-wrapper",
          classNames: "blockquote",
          children: `
          
          <blockquote>
          <small title="${ë.seo.title}">${ë.seo.title}</small>
          <p>${ë.seo.description}</p>
          <h2 class="myHeroHeaderh2">Just Getting Started?</h2>
          <div class="action-container">
          </blockquote>
            `,
          eventHandlers: "submit:preventDefault",
        },
        generateHeaderBlockquote: {
          namespace: ["documentation"],
          id: "blockquote-container",
          container: "blockquote-wrapper",
          classNames: "blockquote",
          children: `
          <blockquote>
          <small title="${ë.seo.title}">${ë.seo.title}</small>
          <p>${ë.seo.description}</p>
          <h2 class="myHeroHeaderh2">Build Quickly!</h2>
          <div class="action-container">
          </blockquote>
            `,
          eventHandlers: "submit:preventDefault",
        },
        genButtonHeader: {
          namespace: ["documentation"],
          dir: "buttons/",
          id: "genbutton",
          container: "action-container",
          classNames: "button round",
          children: `
          <div class="button_wrapper">
              <button class="headerbutton mygenbutton" data-route="generate">Go to Config Builder</button></div>
              <br />
             
            `,
          eventHandlers: "submit:preventDefault",
        },
        docButtonHeader: {
          namespace: ["homeview", "generate"],
          dir: "buttons/",
          id: "docbutton",
          container: "action-container",
          classNames: "button round",
          children: `
            <div class="button_wrapper">
            <button class="headerbutton mydocbutton" data-route="documentation">View Documentation</button></div>
            <br />
            `,
          eventHandlers: "submit:preventDefault",
        },
      },
    },
  };

  return heroHeaderConfig;
});
