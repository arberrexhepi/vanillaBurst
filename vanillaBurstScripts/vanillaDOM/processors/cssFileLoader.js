window.frozenVanilla("cssFileLoader", function (cssPath) {
  // Define the paths for the default CSS file and the CSS file specified by cssPath
  const cssPaths = [window.domainUrl + baseUrl + "style.css", cssPath];

  // Load each CSS file
  cssPaths.forEach((path) => {
    if (path) {
      let linkTag = document.head.querySelector(
        `link[data-css-path="${path}"]`
      );
      if (!linkTag) {
        const nonceString = window.nonceBack();

        linkTag = document.createElement("link");
        linkTag.setAttribute("rel", "stylesheet");
        linkTag.setAttribute("href", path);
        linkTag.setAttribute("data-css-path", path);
        linkTag.setAttribute("nonce", nonceString);
        document.head.appendChild(linkTag);
      }
    }
  });
});
