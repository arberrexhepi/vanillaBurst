window.frozenVanilla("sanitizeVanillaDOM", function (htmlString, functionFile) {
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

    // Check if the document was successfully parsed
    if (doc.body) {
      // Extract the body content
      let bodyContent = doc.body.innerHTML;
      cleanHTML = DOMPurify.sanitize(bodyContent, config);
    } else {
      // If the document was not successfully parsed, sanitize the htmlString directly
      cleanHTML = DOMPurify.sanitize(htmlString, config);
    }

    if (typeof cleanHTML === "undefined") {
      throw new Error("cleanHTML is undefined");
    }

    // Parse the sanitized HTML
    let sanitizedDoc = parser.parseFromString(cleanHTML, "text/html");

    // Get the final HTML with nonces
    let finalHTML = sanitizedDoc.body.innerHTML;

    return finalHTML;
  } catch (error) {
    console.error("An error occurred in sanitizeVanillaDOM:", error);
  }
});
