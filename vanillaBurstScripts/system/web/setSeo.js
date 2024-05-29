//set seo to head tag

if (!ë.seo) {
  ë.seo = {};
}

ë.frozenVanilla("setSeo", function (seo) {
  if (seo) {
    // Set ë.seo to the incoming seo object

    // Define the meta tags to be set
    const metaTags = {
      description: seo.description || "",
      keywords: seo.keywords ? seo.keywords.join(", ") : "",
      author: seo.author || "",
      "og:image": seo.image || "",
      "og:url": seo.url || "",
      "og:site_name": seo.siteName || "",
    };

    // Set the title of the document
    if (seo.title) {
      document.title = seo.title;
      ë.logSpacer("Document title set to:", seo.title, true);
    }

    // Iterate over the metaTags object
    for (const [name, content] of Object.entries(metaTags)) {
      // Find an existing meta tag
      let metaTag = document.querySelector(
        `meta[name="${name}"], meta[property="${name}"]`
      );

      // If the meta tag doesn't exist, create it
      if (!metaTag) {
        metaTag = document.createElement("meta");
        if (name.startsWith("og:")) {
          metaTag.setAttribute("property", name);
        } else {
          metaTag.setAttribute("name", name);
        }
        document.head.appendChild(metaTag);
      }

      // Set the content of the meta tag
      metaTag.setAttribute("content", content);

      // Log the updated or created meta tag
      ë.logSpacer(`Meta tag set: ${name} = ${content}`, null, null, true);
    }
  }
});
