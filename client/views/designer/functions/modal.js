ë.frozenVanilla("modal", function (vanillaPromise) {
  function openNamingModal(callback) {
    const modal = document.createElement("div");
    modal.className = "naming-modal";
    modal.setAttribute("nonce", ë.nonceBack());
    modal.innerHTML = `
      <div class="modal-content">
        <label>Name this element (required):</label>
        <input type="text" id="nameInput" autofocus />
        <button id="confirmName">Confirm</button>
        <p id="nameError" style="color:red;"></p>
      </div>
    `;

    document.body.appendChild(modal);

    const input = modal.querySelector("#nameInput");
    const errorMsg = modal.querySelector("#nameError");

    modal.querySelector("#confirmName").onclick = () => {
      const name = input.value.trim();
      if (!name) {
        errorMsg.textContent = "Name is required.";
        return;
      }
      if (!ë.core().isValidHtmlId(name)) {
        errorMsg.textContent = "Invalid name. Must be a valid HTML ID.";
        return;
      }

      document.body.removeChild(modal);
      callback(name);
    };
  }

  return {
    openNamingModal,
  };
});
