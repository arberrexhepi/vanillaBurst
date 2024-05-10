window.frozenVanilla(
  "htmlFileLoader",
  async function ({ htmlPath, cssPath }, DOMFileLOADcallback) {
    // Centralized nonce management
    function getNonce() {
      let nonceString = window.nonce();
      window.nonceBack(nonceString);
      return nonceString;
    }

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
      const nonceString = getNonce();

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

      const contentToUse = doc.body.innerHTML;
      if (htmlPath) {
        if (typeof DOMFileLOADcallback === "function") {
          DOMFileLOADcallback(contentToUse);
        }
      }

      // Apply nonce to meta and script tags in the main document
      window.nonceBack(nonceString);

      // Apply CSS content using <link> tag
      window.cssFileLoader(cssPath);
    } catch (error) {
      console.error("Error:", error);
    }
  }
);
