ë.frozenVanilla("heroHeaderComponent", async function (data) {
  if (!data) return;

  let heroHeaderComponent = {
    [`${data.id}`]: {
      namespace: [data.namespace] || ["homeview"],
      container: data.container ? data.container : "heroHeader-component",
      classNames: "blockquote",
      children: `
          <div id="hero-logo">
              <div id="header-symbol" data-img-src="symbol.png" data-img-alt="vanillaBurst symbol logo"></div>
              <div id="header-wordmark" data-img-src="wordmark.png" data-img-alt="vanillaBurst wordmark logo"></div>
          </div>
          <div class="blockquote-wrapper">
           <blockquote>
          <small title="${ë.seo[data.namespace].title}">${
        ë.seo[data.namespace].title
      }</small>
          <p>${ë.seo[data.namespace].description}</p>
          <h2 class="myHeroHeaderh2">Build Quickly!</h2>
          <div id="header-button" class="action-container header-button ">
          </blockquote></div>
            
          `,
    },
  };

  return heroHeaderComponent;
});
