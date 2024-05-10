window.frozenVanilla(
  "domPromises",
  function (renderSchema, customFunctionName, originBurst) {
    return new Promise(async (resolve, reject) => {
      let config = renderSchema.customFunctions[customFunctionName];
      let safeHTML;

      if (config?.container) {
        safeHTML = await loadDOM(
          config,
          customFunctionName,
          renderSchema.landing,
          renderSchema,
          originBurst
        );

        if (safeHTML === null) {
          reject(new Error("safeHTML is falsy"));
        }
      }

      if (config?.components) {
        let domCheck = await vanillaComponents(
          customFunctionName,
          renderSchema,
          originBurst,
          safeHTML
        );

        if (domCheck === false) {
          reject(new Error("domCheck is falsy"));
        }
      }

      resolve(safeHTML);
    });
  }
);
