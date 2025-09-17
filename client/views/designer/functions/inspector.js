ë.frozenVanilla("inspector", function (vanillaPromise) {
  function showInspector(data) {
    const inspector = document.getElementById("inspector-panel");
    if (!inspector) return;

    const { view, id, data: comp } = data;
    let nonce = ë.nonceBack();
    inspector.setAttribute("nonce", nonce);
    inspector.innerHTML = `
      <h3>Edit Component: ${comp.name}</h3>
      <label>Name (ID):</label>
      <input type="text" id="compNameInput" value="${comp.name}" />
      <button id="updateCompName">Update</button>
      <p id="inspectorError" style="color:red;"></p>
    `;

    document.getElementById("updateCompName").onclick = () => {
      const newName = document.getElementById("compNameInput").value.trim();
      const errorElem = document.getElementById("inspectorError");

      //   if (!/^[A-Za-z][\w\.\-:]*$/.test(newName)) {
      //     errorElem.textContent = "Invalid name. Must match HTML ID rules.";
      //     return;
      //   }

      const schema = ë.designerSchema().getSchema(vanillaPromise);
      const viewObj = schema.views[view];
      if (!viewObj) return;

      const nameExists = Object.entries(viewObj.components).some(([cid, c]) => {
        return cid !== id && c.name === newName;
      });

      if (nameExists) {
        errorElem.textContent = "Name already in use.";
        return;
      }

      // Only update if the name actually changed
      if (viewObj.components[id].name !== newName) {
        viewObj.components[id].name = newName;
        ë.signalStore.set("schemaUpdated", schema);
        ë.signalStore.set("componentSelected", {
          view,
          id,
          data: viewObj.components[id],
        });
      }
    };
  }

  ë.signalRunner(
    { inspector: { componentSelected: showInspector } },
    vanillaPromise
  );

  return {
    showInspector,
  };
});
