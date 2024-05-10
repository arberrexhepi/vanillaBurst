window.frozenVanilla("gen", function (vanillaPromise) {
  console.log(vanillaPromise.this + " ran");

  //let button = document.getElementById("create-config");

  let subDomClicks = 0;
  $(".addSubDOM").on("click", function (e) {
    subDomClicks++;
    e.preventDefault();

    let newSubDom = $(this).siblings(".subDOMTemplate").first().clone();
    if (subDomClicks === 1) {
      $(this).siblings(".subDOMTemplate").first().css("display", "flex");
    } else {
      newSubDom.insertBefore($(this).siblings(".subDOMTemplate").first());
      newSubDom.css("display", "flex");
    }
  });

  $("#create-config").on("click", function (e) {
    e.preventDefault();
    nodeConfigBuild();
  });

  //move this to its own functionFile, this gen view might get more complex
  function nodeConfigBuild() {
    // Find the container for the draggable nodes
    const configCanvas = document.querySelector("#viewbox");
    const nodes = configCanvas.querySelectorAll(".parentnode");

    let configString = "";

    // Define a function that generates a configuration object
    function generateConfig(
      functionFile,
      dir,
      originBurst,
      htmlPath,
      cssPath,
      targetDOM,
      subDOMObject
    ) {
      let config = {};
      config[functionFile] = {
        role: "parent",
        dir: dir,
        functionFile: functionFile,
        render: "pause",
        originBurst: originBurst,
        htmlPath: htmlPath,
        cssPath: cssPath,
        targetDOM: targetDOM,
        subDOM: subDOMObject,
      };
      return config;
    }

    // Use the function in your loop
    nodes.forEach((node) => {
      // ... (same as before)

      // Construct the configuration object for each node
      let nodeConfig = generateConfig(
        functionFile,
        dir,
        originBurst,
        htmlPath,
        cssPath,
        targetDOM,
        subDOMObject
      );

      // Merge nodeConfig with sharedParts and vanillaConfig
      let mergedConfig = { ...nodeConfig, ...sharedParts };
      let finalConfig = { ...vanillaConfig(functionFile, mergedConfig) };

      // Add the final configuration to the window object
      window[`${functionFile}Config`] = finalConfig;
    });

    console.log("Generated vanillaBurst Config:", configString);

    // Optional: Copy the config to clipboard
    navigator.clipboard.writeText(configString).then(
      function () {
        alert("Config copied to clipboard!");

        console.log("Copying to clipboard was successful!");
      },
      function (err) {
        console.error("Could not copy text: ", err);
      }
    );
  }
});
