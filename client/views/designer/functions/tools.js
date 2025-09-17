ë.frozenVanilla("tools", function (vanillaPromise) {
  function activateShapeTool(vanillaPromise, viewName) {
    ë.modal().openNamingModal(function (name) {
      const toolData = {
        type: "shape",
        shape: "rectangle",
        properties: {
          width: 100,
          height: 50,
          color: "#000",
        },
        name,
      };
      ë.layers().createElement(vanillaPromise, viewName, toolData);
    });
  }

  function activateTextTool(vanillaPromise, viewName) {
    ë.modal().openNamingModal(function (name) {
      const toolData = {
        type: "text",
        text: "Sample Text",
        properties: {
          fontSize: 14,
          color: "#333",
        },
        name,
      };
      ë.layers().createElement(vanillaPromise, viewName, toolData);
    });
  }

  // Future tool stubs
  // function activateGradientTool(...) {}
  // function activateCodeInsertTool(...) {}
  // function activateMoveTool(...) {}

  return {
    activateShapeTool,
    activateTextTool,
  };
});
