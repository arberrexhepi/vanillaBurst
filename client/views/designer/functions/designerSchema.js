ë.frozenVanilla("designerSchema", function (vanillaPromise) {
  let uiSchema = {
    views: { designerview: {} },
  };

  function createView(name) {
    if (!name) return console.warn("View name is required.");
    uiSchema.views[name] = {
      name: name,
      components: {},
      states: {},
    };
    ë.signalStore.set("schemaUpdated", uiSchema);
  }

  function getSchema(vanillaPromise) {
    let schemaUpdated = ë.vanillaAccessor(
      vanillaPromise,
      "schemaUpdated",
      "designerSchema"
    );
    if (!schemaUpdated) {
      console.warn("No schema found, returning default.");
      uiSchema = {
        views: { designerview: {} },
      };
    } else {
      uiSchema = schemaUpdated;
      ë.storage().saveSchema(uiSchema);
    }
    return uiSchema;
  }

  function setSchema(newSchema) {
    uiSchema = newSchema;
    ë.signalStore.set("schemaUpdated", uiSchema);
  }

  return {
    createView,
    getSchema,
    setSchema,
  };
});
