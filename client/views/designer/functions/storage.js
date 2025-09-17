ë.frozenVanilla("storage", function (vanillaPromise) {
  const DB_NAME = "UIUXTool";
  const STORE_NAME = "SchemaStore";
  let db = null;

  function initDB() {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = function (e) {
      db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = function (e) {
      db = e.target.result;
      ë.signalStore.set("dbReady", true);
      loadSchema();
    };
  }

  function saveSchema(schema) {
    if (db) {
      const tx = db.transaction([STORE_NAME], "readwrite");
      tx.objectStore(STORE_NAME).put({ id: "current", data: schema });
    }
    localStorage.setItem("uiSchemaBackup", JSON.stringify(schema));
    ë.signalStore.set("persistedSchema", schema);
    console.log("Schema loaded:", schema);
  }

  function loadSchema() {
    const tx = db.transaction([STORE_NAME], "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get("current");
    request.onsuccess = function () {
      const schema =
        request.result?.data ||
        JSON.parse(localStorage.getItem("uiSchemaBackup")) ||
        {};
      ë.signalStore.set("schemaLoaded", schema);
    };
  }

  function exportSchema(schema) {
    const blob = new Blob([JSON.stringify(schema, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "uiSchema.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importSchemaFromJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.views) throw new Error("Invalid schema structure");
      ë.signalStore.set("schemaLoaded", parsed);
    } catch (e) {
      alert("Invalid JSON schema import.");
    }
  }

  ë.signalRunner({ storage: { schemaUpdated: saveSchema } }, vanillaPromise);

  return {
    initDB,
    saveSchema,
    exportSchema,
    importSchemaFromJSON,
  };
});
