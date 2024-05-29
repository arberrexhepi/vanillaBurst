//This was an idea I was trying to make it clearer as to where components were placed in HTML files however, tricky with CSP, so I opted to use -wrapper affix on classes or IDs for now.

// function defineVanillaElement() {
//   return new Promise((resolve) => {
//     class VanillaElement extends HTMLElement {
//       constructor() {
//         super();
//       }

//       connectedCallback() {
//         this.render();
//       }

//       render() {
//         const id = this.getAttribute("id");
//         this.innerHTML = `<div name="${id}">
//                               <!-- Button will be dynamically added here -->
//                             </div>`;
//       }
//     }

//     if (!customElements.get("vanilla-element")) {
//       customElements.define("vanilla-element", VanillaElement);
//     }

//     resolve();
//   });
// }
