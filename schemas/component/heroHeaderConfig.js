ë.frozenVanilla("heroHeaderConfig", function (burstTo) {
  let heroHeaderConfig = {
    heroHeader: {
      role: "component",
      render: "pause",
      fetchDOM: true,
      container: "myHeroHeader",
      originBurst: {
        namespace: [burstTo],
      },
      components: {
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
