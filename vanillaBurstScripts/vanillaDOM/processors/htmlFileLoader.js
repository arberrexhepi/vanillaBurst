ë.frozenVanilla(
  "htmlFileLoader",
  async function (
    {
      htmlPath,
      cssPath,
      originFunction,
      functionFile,
      htmlExists,
      passedFunction,
    },
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
      let nonceString = ë.nonceBack();

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
            div.setAttribute("nonce", ë.nonceBack());
            div.innerHTML =
              storedBurst[originFunction][functionFile].htmlResult;
          }

          // Determine the root element (either the div or the body of the doc)
          let root = div || doc.body;

          ë.logSpacer(
            "%c" + functionFile + " proceeding to render with cache",
            "",
            "color: white; font-weight: bold; font-size:18px;"
          );

          contentToUse = root.innerHTML;
        } catch (error) {
          console.error("An error occurred while parsing the HTML:", error);
        }
      } else {
        if (!htmlPath && passedFunction.container) {
          contentToUse = "";
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
            let nonceString = ë.nonceBack();
            img.setAttribute("nonce", nonceString);
          }

          let formElements = doc.getElementsByTagName("form");
          for (let form of formElements) {
            let nonceString = ë.nonceBack();
            form.setAttribute("nonce", nonceString);
          }

          // Ensure that the HTML content is correctly extracted
          contentToUse = doc.documentElement.outerHTML;
          ë.logSpacer(
            "%c" + functionFile + " proceeding to render without cache",
            "",
            "color: white; font-weight: bold; font-size:18px;",
            true
          );
        }
      }

      if (htmlPath) {
        if (typeof DOMFileLOADcallback === "function") {
          functionHTML = await ë.sanitizeVanillaDOM(contentToUse, functionFile);
          DOMFileLOADcallback(functionHTML);
        }
      } else {
        functionHTML = await ë.sanitizeVanillaDOM(contentToUse, functionFile);
        DOMFileLOADcallback(functionHTML);
      }

      // Apply nonce to meta and script tags in the main document

      // Apply CSS content using <link> tag
      ë.cssFileLoader(cssPath);
    } catch (error) {
      ë.logSpacer(console.error("Error:", error), null, null, true);
    }
  }
);
