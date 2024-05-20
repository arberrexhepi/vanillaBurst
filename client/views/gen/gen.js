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

  //move this to its own functionName, this gen view might get more complex
  function nodeConfigBuild() {
    alert("Config Generated. Check the bottom of this page for the code!");
    // Find the container for the draggable nodes
    const configCanvas = document.querySelector(".config-canvas");
    const nodes = configCanvas.querySelectorAll(".parentnode");

    // Define a function that generates a configuration object
    function generateConfig() {
      // Get the form values
      const form = document.querySelector("#parentConfigForm");
      const functionName = form.querySelector("#functionName").value;
      const dir = form.querySelector("#directory").value;
      const originBurst = form.querySelector("#originburst").value;
      const htmlPath = form.querySelector("#htmlPath").value;
      const cssPath = form.querySelector("#cssPath").value;
      const targetDOM = form.querySelector("#targetDOM").value;

      // Get the subDOM values
      const subDOMTemplate = form.querySelector(".subDOMTemplate");
      const subDOMHtmlPath = subDOMTemplate.querySelector(
        "[name='subDOMHtmlPath']"
      ).value;
      const subDOMCssPath = subDOMTemplate.querySelector(
        "[name='subDOMCssPath']"
      ).value;
      const subDOMTargetDOM = subDOMTemplate.querySelector(
        "[name='subDOMTargetDOM']"
      ).value;
      const subDOMHtmlAttrId = subDOMTemplate.querySelector(
        "[name='subDOMHtmlAttrId']"
      ).value;
      const subDOMHtmlAttrCssClass = subDOMTemplate.querySelector(
        "[name='subDOMHtmlAttrCssClass']"
      ).value;

      // Create the subDOMObject
      const subDOMObject = {
        htmlPath: subDOMHtmlPath,
        cssPath: subDOMCssPath,
        targetDOM: subDOMTargetDOM,
        htmlAttrs: {
          id: subDOMHtmlAttrId,
          cssClass: subDOMHtmlAttrCssClass,
        },
      };

      let config = {};
      config[functionName] = {
        role: "parent",
        dir: dir,
        functionName: functionName,
        render: "pause",
        originBurst: originBurst,
        htmlPath: htmlPath,
        cssPath: cssPath,
        targetDOM: targetDOM,
        subDOM: subDOMObject,
      };
      return config;
    }

    let finalConfigs = [];

    nodes.forEach((node) => {
      // Construct the configuration object for each node
      let nodeConfig = generateConfig();
      let sharedParts = {};

      // Merge nodeConfig with sharedParts and vanillaConfig
      let mergedConfig = { ...nodeConfig, ...sharedParts };
      // let finalConfig = { ...vanillaConfig(functionName, mergedConfig) };

      // Add the final configuration to the window object
      console.log("functionName:", functionName.value);
      console.log("mergedConfig:", mergedConfig);

      if (typeof functionName.value === "string" && mergedConfig) {
        window[`${functionName.value}Config`] = mergedConfig;
      } else {
        console.error("Cannot set property on window object");
      }
      //window.frozenVanilla(functionName, mergedConfig);

      // Add the final configuration to the finalConfigs array
      finalConfigs.push(mergedConfig);
    });

    let configResultDiv = document.getElementById("config-result-gen_gen");

    if (configResultDiv) {
      // Convert the finalConfigs array to a string
      const configString = JSON.stringify(finalConfigs, null, 2); // Beautify the JSON string
      if (configResultDiv) {
        // Convert the finalConfigs array to a string
        const configString = JSON.stringify(finalConfigs, null, 2); // Beautify the JSON string
        configResultDiv.innerHTML = `<pre>${configString}</pre>`;

        // vanillaComponents(functionFile, renderSchema, vanillaPromise);

        window.directComponentCache(
          "config-result-gen_gen",
          configResultDiv.outerHTML
        );
      }
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(configString).then(
        function () {
          alert("Config copied to clipboard!");
          console.log("Copying to clipboard was successful!");
        },
        function (err) {
          console.error("Could not copy text: ", err);
        }
      );
    } else {
    }
  }
});
