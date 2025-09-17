ë.frozenVanilla("renderer", function (vanillaPromise) {
  function renderSchema(schema) {
    try {
      const container = document.getElementById("ui-canvas");
      if (!container) {
        console.error("Cannot find #ui-canvas in DOM.");
        return;
      }

      container.setAttribute("nonce", ë.nonceBack());
      container.innerHTML = "";

      if (!schema.views) {
        console.warn("No views found in schema.");
        return;
      }

      Object.entries(schema.views).forEach(([viewKey, view]) => {
        const viewNode = document.createElement("div");
        viewNode.className = "view";
        viewNode.setAttribute("data-view", viewKey);

        if (!view.components) {
          console.warn(`No components in view: ${viewKey}`);
          return;
        }

        Object.entries(view.components).forEach(([compId, comp]) => {
          const compNode = renderComponent(
            vanillaPromise,
            viewKey,
            compId,
            comp
          );
          viewNode.appendChild(compNode);
        });

        container.appendChild(viewNode);
      });
    } catch (err) {
      console.error("Fatal error in renderSchema:", err);
    }
  }

  function renderComponent(vanillaPromise, viewKey, compId, comp) {
    const node = document.createElement("div");
    node.className = `component ${comp.type || "wrapper"}`;
    node.setAttribute("data-comp", compId);
    node.setAttribute("nonce", ë.nonceBack());
    node.innerText = comp.name;

    node.onclick = function () {
      ë.signalStore.set("componentSelected", {
        view: viewKey,
        id: compId,
        data: comp,
      });
    };

    if (comp.children) {
      Object.entries(comp.children).forEach(([childId, child]) => {
        try {
          const childNode = renderChild(childId, child);
          node.appendChild(childNode);
        } catch (childErr) {
          console.error(`Error rendering child ${childId}:`, childErr);
        }
      });
    }

    return node;
  }

  ë.signalRunner({ rendered: { schemaUpdated: renderSchema } }, vanillaPromise);

  return {
    renderSchema,
  };
});
