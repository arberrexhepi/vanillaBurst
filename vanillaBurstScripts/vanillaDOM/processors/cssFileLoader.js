window.frozenVanilla("cssFileLoader", function (cssPath) {
  if (cssPath) {
    let linkTag = document.head.querySelector(
      `link[data-css-path="${cssPath}"]`
    );
    if (!linkTag) {
      const nonceString = getNonce();

      linkTag = document.createElement("link");
      linkTag.setAttribute("rel", "stylesheet");
      linkTag.setAttribute("href", cssPath);
      linkTag.setAttribute("data-css-path", cssPath);
      linkTag.setAttribute("nonce", nonceString);
      document.head.appendChild(linkTag);
    }
  }
});
