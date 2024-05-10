function defineVanillaElement() {
  return new Promise((resolve) => {
    class VanillaElement extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        this.render();
      }

      render() {
        const id = this.getAttribute("id");
        this.innerHTML = `<div name="${id}">
                              <!-- Button will be dynamically added here -->
                            </div>`;
      }
    }

    if (!customElements.get("vanilla-element")) {
      customElements.define("vanilla-element", VanillaElement);
    }

    resolve();
  });
}
