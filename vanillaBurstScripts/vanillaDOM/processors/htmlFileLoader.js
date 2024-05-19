window.frozenVanilla(
  "htmlFileLoader",
  async function (
    { htmlPath, cssPath, originFunction, functionFile },
    DOMFileLOADcallback
  ) {
    // Centralized nonce management

    try {
      const getContent = async (path) => {
        const response = await fetch(path);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const content = await response.text();
        return content;
      };

      // Get HTML content
      let nonceString = window.nonceBack();

      let contentToUse;
      const storedBurst = JSON.parse(localStorage.getItem("originBurst")) || {};
      if (
        storedBurst &&
        storedBurst[originFunction] &&
        storedBurst[originFunction][functionFile] &&
        storedBurst[originFunction][functionFile].htmlResult !== null
      ) {
        try {
          const parser = new DOMParser();
          let doc = parser.parseFromString(
            storedBurst[originFunction][functionFile].htmlResult,
            "text/html"
          );

          let div;

          // If doc is not defined, create a new div and set its innerHTML to the HTML result
          if (!doc || !doc.body) {
            div = document.createElement("div");
            div.innerHTML =
              storedBurst[originFunction][functionFile].htmlResult;
          }

          // Determine the root element (either the div or the body of the doc)
          let root = div || doc.body;

          console.log(
            "%c" + functionFile + " proceeding to render with cache",
            "color: white; font-weight: bold; font-size:18px;"
          );

          contentToUse = root.innerHTML;
        } catch (error) {
          console.error("An error occurred while parsing the HTML:", error);
        }
      } else {
        const htmlText = await getContent(htmlPath);
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");

        // Apply nonce to script and style elements
        let scriptElements = doc.getElementsByTagName("script");
        for (let i = 0; i < scriptElements.length; i++) {
          scriptElements[i].nonce = nonceString;
        }

        let styleElements = doc.getElementsByTagName("style");
        for (let i = 0; i < styleElements.length; i++) {
          styleElements[i].nonce = nonceString;
        }

        // Add a nonce to all img elements in the sanitized HTML
        let imgElements = doc.getElementsByTagName("img");
        for (let img of imgElements) {
          let nonceString = window.nonceBack();
          img.setAttribute("nonce", nonceString);
        }

        let formElements = doc.getElementsByTagName("form");
        for (let form of formElements) {
          let nonceString = window.nonceBack();
          form.setAttribute("nonce", nonceString);
        }

        // Ensure that the HTML content is correctly extracted
        contentToUse = doc.documentElement.outerHTML;
        console.log(
          "%c" + functionFile + " proceeding to render without cache",
          "color: white; font-weight: bold; font-size:18px;"
        );
      }

      if (htmlPath) {
        if (typeof DOMFileLOADcallback === "function") {
          functionHTML = await window.sanitizeVanillaDOM(
            contentToUse,
            functionFile
          );
          DOMFileLOADcallback(functionHTML);
        }
      }

      // Apply nonce to meta and script tags in the main document

      // Apply CSS content using <link> tag
      window.cssFileLoader(cssPath);
    } catch (error) {
      console.error("Error:", error);
    }
  }
);
