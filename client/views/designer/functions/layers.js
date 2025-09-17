ë.frozenVanilla("layers", function (vanillaPromise) {
  function createElement(vanillaPromise, viewName, toolData) {
    const schema = ë.designerSchema().getSchema();
    const view = schema.views[viewName];

    if (!view) {
      console.warn("View does not exist:", viewName);
      return;
    }

    // Ensure components object exists
    if (!view.components) {
      view.components = {};
    }

    const id = ë.core().generateId("comp");

    view.components[id] = {
      name: toolData.name,
      type: toolData.type || "wrapper",
      meta: toolData,
      children: {},
    };

    ë.signalStore.set("schemaUpdated", schema);
    ë.signalStore.set("elementCreated", {
      view: viewName,
      id: id,
      data: view.components[id],
    });
    console.log("Element created:", id, toolData);
  }

  function addComponentToView(vanillaPromise, viewName) {
    ë.modal().openNamingModal(function (componentName) {
      const toolData = {
        type: "wrapper",
        name: componentName,
      };
      createElement(vanillaPromise, viewName, toolData);
    });
  }

  function addChildToComponent(vanillaPromise, viewName, parentId) {
    ë.modal().openNamingModal(function (childName) {
      const schema = ë.designerSchema().getSchema();
      const view = schema.views[viewName];
      const parent = view?.components[parentId];

      if (!parent) {
        console.warn("Parent component does not exist:", parentId);
        return;
      }

      const childId = ë.core().generateId("child");
      parent.children[childId] = {
        name: childName,
        type: "child",
      };

      ë.signalStore.set("schemaUpdated", schema);
      ë.signalStore.set("elementCreated", {
        view: viewName,
        id: childId,
        data: parent.children[childId],
      });
    });
  }

  return {
    createElement,
    addComponentToView,
    addChildToComponent,
  };
});
