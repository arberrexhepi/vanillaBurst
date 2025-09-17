ë.frozenVanilla("core", function (vanillaPromise) {
  function generateId(prefix = "id") {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function isValidHtmlId(name) {
    return /^[A-Za-z][\w\.\-:]*$/.test(name);
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (match) {
      const escapeMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      };
      return escapeMap[match];
    });
  }

  return {
    generateId,
    deepClone,
    isValidHtmlId,
    escapeHtml,
  };
});
