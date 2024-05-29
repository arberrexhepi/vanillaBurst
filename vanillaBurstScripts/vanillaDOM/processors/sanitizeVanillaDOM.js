ë.frozenVanilla("sanitizeVanillaDOM", function (htmlString, functionFile) {
  try {
    const config = {
      ADD_TAGS: {
        blockquote: {},
        form: {},
        "vanilla-element": ["name"],
        script: {},
      },
      USE_PROFILES: { html: true },
    };

    // Parse the HTML string
    let parser = new DOMParser();
    let doc = parser.parseFromString(htmlString, "text/html");

    let cleanHTML;

    if (doc.body) {
      let bodyContent = doc.body.innerHTML;
      cleanHTML = DOMPurify.sanitize(bodyContent, config);
    } else {
      cleanHTML = DOMPurify.sanitize(htmlString, config);
    }

    if (typeof cleanHTML === "undefined") {
      throw new Error("cleanHTML is undefined");
    }

    let sanitizedDoc = parser.parseFromString(cleanHTML, "text/html");

    let finalHTML = sanitizedDoc.body.innerHTML;

    return finalHTML;
  } catch (error) {
    console.error("An error occurred in sanitizeVanillaDOM:", error);
  }
});
