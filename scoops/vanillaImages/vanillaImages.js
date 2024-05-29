ë.frozenVanilla("vanillaImages", function (runCSS) {
  if (runCSS === true) {
    //vanillaScoop: vanillaCSS
    ë.vanillaMess(
      "[Scoop][vanillaCSS] Checking for plugin",
      ë.vanillaCSS,
      "function"
    );

    try {
      let assets = Array.from(document.getElementsByTagName("div")).filter(
        (div) =>
          Array.from(div.attributes).some((attr) =>
            attr.name.startsWith("data-img-")
          )
      );
      if (assets.length > 0) {
        let validImgAttrs = [
          "alt",
          "height",
          "width",
          "srcset",
          "sizes",
          "loading",
          "crossorigin",
          "usemap",
          "ismap",
          "decoding",
          "referrerpolicy",
          "class",
        ];
        assets.forEach((asset) => {
          if (!asset.querySelector("img")) {
            let assetFile = asset.getAttribute("data-img-src");
            let assetBaseUrl = ë.baseUrlImages;
            let img = document.createElement("img");
            img.src = `${assetBaseUrl}${assetFile}`;
            if (asset.className) {
              img.className = asset.className;
            }
            if (asset.id) {
              img.id = asset.id + "-img";
            }
            for (let i = 0; i < asset.attributes.length; i++) {
              let attr = asset.attributes[i];
              if (
                attr.name.startsWith("data-img-") &&
                attr.name !== "data-img-src"
              ) {
                let imgAttr = attr.name.substring(9);
                if (validImgAttrs.includes(imgAttr)) {
                  img[imgAttr] = attr.value;
                }
              }
            }

            asset.appendChild(img);
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
});
