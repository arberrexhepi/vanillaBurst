// Set trusted CSP sources
ë.frozenVanilla("setTrustedSources", (sources) => {
  const cspMetaTag =
    document.querySelector('meta[http-equiv="Content-Security-Policy"]') ||
    document.createElement("meta");
  const existingDirectives =
    cspMetaTag.getAttribute("content")?.split(";") || [];
  const newCSP = existingDirectives.reduce((csp, directive) => {
    const [key, ...values] = directive.trim().split(" ");
    if (key) {
      csp[key] = [...new Set((csp[key] || []).concat(values))];
    }
    return csp;
  }, {});

  Object.keys(sources).forEach((key) => {
    newCSP[key] = [...new Set((newCSP[key] || []).concat(sources[key]))];
  });

  const cspString = Object.keys(newCSP)
    .map((key) => `${key} ${newCSP[key].join(" ")}`)
    .join("; ");
  if (!cspMetaTag.isConnected) {
    cspMetaTag.setAttribute("http-equiv", "Content-Security-Policy");
    document.head.appendChild(cspMetaTag);
  }
  cspMetaTag.setAttribute("content", cspString);
});
