ë.frozenVanilla(
  "vanillaPromise",
  function (
    renderSchema,
    customFunctionName,
    passedFunction,
    serverResult,
    originBurst
  ) {
    let vanillaPromise;

    if (!vanillaPromise || typeof vanillaPromise !== "object") {
      vanillaPromise = {};
      vanillaPromise = {
        schema: ë.schema, //TODO check if namespace equals global or not, and pass only the scopes in namespace from config
        renderSchema: renderSchema,
        this: customFunctionName,
        landing: renderSchema.landing,
        passedFunction: passedFunction,
        serverResult: serverResult,
        originBurst: originBurst,
        runFunction: true,
      };
    } else {
      vanillaPromise.serverResult = serverResult;
      vanillaPromise.originBurst = originBurst;
    }

    return vanillaPromise;
  }
);
