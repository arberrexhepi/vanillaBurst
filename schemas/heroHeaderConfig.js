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
        documentationHeaderBlockquote: {
          namespace: ["homeview", "gen"],
          //parent: true,
          id: "blockquote-container",
          container: "blockquote-wrapper",
          className: "blockquote",
          children: `
          
          <blockquote>
          <small title="${window.seo.title}">${window.seo.title}</small>
          <p>${window.seo.description}</p>
          <h2 class="myHeroHeaderh2">Just Getting Started?</h2>
          <div class="action-container">
          </blockquote>
            `,
          eventHandlers: "submit:preventDefault",
        },
        generateHeaderBlockquote: {
          namespace: ["documentation"],
          //parent: true,
          id: "blockquote-container",
          container: "blockquote-wrapper",
          className: "blockquote",
          children: `
          <blockquote>
          <small title="${window.seo.title}">${window.seo.title}</small>
          <p>${window.seo.description}</p>
          <h2 class="myHeroHeaderh2">Hey TLDRs...Build Quickly!</h2>
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
          className: "button round",
          children: `
          <div class="button_wrapper">
              <button class="headerbutton mygenbutton" data-route="gen">Go to Config Builder</button></div>
              <br />
             
            `,
          eventHandlers: "submit:preventDefault",
        },
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
            `,
          eventHandlers: "submit:preventDefault",
        },
      },
    },
  };

  return heroHeaderConfig;
});
