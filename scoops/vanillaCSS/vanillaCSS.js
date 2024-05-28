ë.frozenVanilla("vanillaCSS", function (runCSS) {
  if (runCSS === true) {
    //vanillaScoop: vanillaCSS
    ë.vanillaMess(
      "[Scoop][vanillaCSS] Checking for plugin",
      ë.vanillaCSS,
      "function"
    );

    try {
      let assets = document.querySelectorAll("div[data-img]");
      if (assets.length > 0) {
        assets.forEach((asset) => {
          if (!asset.querySelector("img")) {
            let assetFile = asset.getAttribute("data-img");
            let assetAlt = asset.getAttribute("data-alt");
            let assetBaseUrl = ë.baseUrlImages;
            let img = document.createElement("img");
            img.src = `${assetBaseUrl}${assetFile}`;
            img.alt = assetAlt;
            if (asset.className) {
              img.className = asset.className;
            }
            if (asset.id) {
              img.id = asset.id + "-img";
            }
            asset.appendChild(img);
          }
        });
      }
      //  else {
      //   console.error("No element with data-img attribute found");
      // }
    } catch (error) {
      console.error(error);
    }
  }
});
