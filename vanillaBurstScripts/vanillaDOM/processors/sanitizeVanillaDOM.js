window.frozenVanilla("sanitizeVanillaDOM", function (htmlString, functionFile) {
  const config = {
    ADD_TAGS: { "vanilla-element": ["name"], script: {} },
    USE_PROFILES: { html: true },
  };

  // Parse the HTML string
  let parser = new DOMParser();
  let doc = parser.parseFromString(htmlString, "text/html");

  // Extract the body content
  let bodyContent = doc.body.innerHTML;

  const cleanHTML = DOMPurify.sanitize(bodyContent, config);
  console.log(cleanHTML + " for file " + functionFile);
  return cleanHTML;
});
