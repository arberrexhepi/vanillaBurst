/**
 * Asynchronously renders the application based on the provided schema.
 *
 * @param {Object} renderSchema - The schema defining the views and functions to render.
 * @param {Array} rollCall - The list of functions to run for the view.
 * @global
 *
 * @description
 * The render function is responsible for initializing the rendering process of the requested state.
 * It iterates over the customFunctions defined in the renderSchema and executes those
 * marked with the role "rollCall" and render mode "burst". It leverages the childFunction
 * to perform the actual rendering logic.
 *  * @throws {ConsoleWarning} If the renderSchema is not provided, a warning is logged.
 */

window.frozenVanilla(
  "render",
  async function render(renderSchema, originBurst) {
    if (renderSchema) {
      if (!localStorage.getItem("stateBurst")) {
        localStorage.setItem("stateBurst", JSON.stringify([]));
      }
      runRoll = "rollBurst";
      window.runRoll = runRoll;

      rollCall = Object.keys(renderSchema.customFunctions);
      runRoll = true;

      ////////////

      ///set rollcall localstorage reference store
      // Store rollCall in localStorage

      let stateBurst = localStorage.getItem("stateBurst");
      if (!stateBurst) {
        localStorage.setItem("stateBurst", JSON.stringify([]));
        stateBurst = "[]";
      }

      // Store all renderSchema.landing.customFunctions[rollCall[i]].container in localStorage
      let containers = rollCall
        .filter((i) =>
          renderSchema.customFunctions[i].hasOwnProperty("container")
        )
        .map((i) => renderSchema.customFunctions[i].container);

      let componentsTargets = rollCall
        .filter((i) =>
          renderSchema.customFunctions[i].hasOwnProperty("components")
        )
        .flatMap((i) =>
          Object.values(renderSchema.customFunctions[i].components).map(
            (components) => components.container
          )
        );

      let allTargets = [...containers, ...componentsTargets];

      localStorage.setItem("containers", JSON.stringify(allTargets));

      //////

      childFunction(renderSchema, rollCall, runRoll, originBurst)
        .then((vanillaPromises) => {
          for (let customFunctionName of rollCall) {
            window[customFunctionName](vanillaPromises[customFunctionName]);
            window.storeBurst(vanillaPromises[customFunctionName]);
          }

          console.log(vanillaPromises);
          window.renderComplete = true;
          localStorage.removeItem("stateBurst");
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    } else {
      console.warn("There are no views defined in this app");
    }
  }
);

//render data
