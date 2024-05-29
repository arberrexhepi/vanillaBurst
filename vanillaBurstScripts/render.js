/**
 * Asynchronously renders the application based on the provided schema.
 *
 * @param {Object} renderSchema - The schema defining the views and functions to render.
 * @param {Object} originBurst - The initial state to be passed to the functions.
 * @global
 *
 * @description
 * The render function initializes the rendering process based on the provided schema.
 * It iterates over the customFunctions defined in the renderSchema and executes those
 * marked with the role "rollCall" and render mode "burst". It leverages the childFunction
 * to perform the actual rendering logic.
 *
 * @throws {Error} If an error occurs during the rendering process, it is logged to the console.
 * @throws {ConsoleWarning} If the renderSchema is not provided, a warning is logged to the console.
 */
ë.frozenVanilla("render", async function render(renderSchema) {
  if (!renderSchema) {
    console.warn("There are no views defined in this app");
    return;
  }
  ë.logSpacer();
  ë.logSpacer(
    "%c[Render Started]",
    "",
    "color: white; font-weight: bold; font-size:24px;",
    true
  );

  let originBurst = JSON.parse(localStorage.getItem("originBurst"));

  if (!originBurst) {
    originBurst = {};

    ë.logSpacer(
      "Initializing originBurst entry: originBurst = {}",
      null,
      null,
      true
    );
  } else {
    ë.logSpacer(
      "Initializing originBurst Entry: Cache found",
      null,
      null,
      true
    );
  }

  initializeLocalStorage();

  const runRoll = true;
  const rollCall = Object.keys(renderSchema.customFunctions);
  ë.runRoll = "rollBurst";

  const containers = collectContainers(rollCall, renderSchema);
  localStorage.setItem("containers", JSON.stringify(containers));
  let landingReference;
  try {
    const vanillaPromises = await ë.childFunction(
      renderSchema,
      rollCall,
      runRoll,
      originBurst
    );

    const loadedContainers = JSON.parse(localStorage.getItem("containers"));
    if (loadedContainers) {
      const promises = loadedContainers.map(
        (container) =>
          new Promise((resolve) => {
            const checkExist = setInterval(() => {
              if (
                document.getElementById(container) ||
                document.querySelector(`.${container}`)
              ) {
                clearInterval(checkExist);
                resolve();
              }
            }, 10);
          })
      );

      await Promise.all(promises);

      ë.logSpacer(
        "%c[Executing JavaScript!]",
        "",
        "color: white; font-weight: bold; font-size:24px;"
      );

      for (const customFunctionName of rollCall) {
        landingReference = customFunctionName;
        try {
          ë[customFunctionName](vanillaPromises[customFunctionName]);
          ë.storeBurst(vanillaPromises[customFunctionName]);
        } catch (error) {
          ë.vanillaMess("render", error, "checking");
          throw new Error(
            "JS File reference or errors found at: " + landingReference
          );
        }
      }
      let seo =
        vanillaPromises[renderSchema.landing].renderSchema.customFunctions[
          renderSchema.landing
        ].seo;

      ë.setSeo(seo);

      ë.renderComplete = true;

      console.log(
        "%c🍦🎉 vanillaBurst COMPLETE 🎉🍦",
        "color: #F3E5AB; font-weight: bold; font-size: 30px; background-color: #333; padding: 10px; border-radius: 5px;"
      );
      localStorage.removeItem("stateBurst");
    }
  } catch (error) {
    console.error("An error occurred during:" + landingReference, error);
  }
});

/**
 * Initializes localStorage if required.
 */
function initializeLocalStorage() {
  if (!localStorage.getItem("stateBurst")) {
    localStorage.setItem("stateBurst", JSON.stringify([]));
  }
}

/**
 * Collects all containers from the renderSchema.
 *
 * @param {Array} rollCall - List of function names to execute for rendering.
 * @param {Object} renderSchema - The schema defining the views and functions to render.
 *
 * @returns {Array} - List of containers to be added in localStorage.
 */
function collectContainers(rollCall, renderSchema) {
  const containers = rollCall
    .filter((fn) =>
      renderSchema.customFunctions[fn].hasOwnProperty("container")
    )
    .map((fn) => renderSchema.customFunctions[fn].container);

  const componentsTargets = rollCall
    .filter((fn) =>
      renderSchema.customFunctions[fn].hasOwnProperty("components")
    )
    .flatMap((fn) =>
      Object.values(renderSchema.customFunctions[fn].components).map(
        (component) => component.container
      )
    );

  return [...containers, ...componentsTargets];
}
