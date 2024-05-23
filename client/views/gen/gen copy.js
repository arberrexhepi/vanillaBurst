window.frozenVanilla("gen", function (vanillaPromise) {
  console.log(vanillaPromise.this + " ran");

  //let button = document.getElementById("create-config");

  let subDomClicks = 0;
  $(".addSubDOM").on("click", function (e) {
    subDomClicks++;
    e.preventDefault();

    let newSubDom = $(this).siblings(".componentTemplate").first().clone();
    if (subDomClicks === 1) {
      $(this).siblings(".componentTemplate").first().css("display", "flex");
    } else {
      newSubDom.insertBefore($(this).siblings(".componentTemplate").first());
      newSubDom.css("display", "flex");
    }
  });

  $("#create-config").on("click", function (e) {
    e.preventDefault();
    nodeConfigBuild();
  });

  //move this to its own functionName, this gen view might get more complex
  function nodeConfigBuild() {
    const configCanvas = document.querySelector(".config-canvas");
    const nodes = configCanvas.querySelectorAll(".parentnode");
    const viewName = $("#viewName").val();
    const dir = $("#dir").val();
    const htmlPath = $("#htmlPath").val();
    const container = $("#container").val();

    // Validation for required fields
    const validations = [
      {
        condition: !viewName || viewName.trim() === "",
        message: "viewName is required",
      },

      {
        condition: htmlPath && (!container || container.trim() === ""),
        message: "container is required if htmlPath is set",
      },
      {
        condition: container && (!htmlPath || htmlPath.trim() === ""),
        message: "htmlPath is required if container is set",
      },
    ];

    for (const { condition, message } of validations) {
      if (condition) {
        window.updateComponent(
          vanillaPromise,
          `[validation] Error: ${message}`,
          "canvasresult",
          ".config-result"
        );
        return;
      }
    }

    function generateConfig(viewName) {
      const render = $("#render").val() || "pause";
      const cssPath = $("#cssPath").val();

      let components = {};
      $(".componentTemplate").each(function () {
        const componentName = $(this).find(".componentName").val();
        if (!componentName) return; // Skip empty templates

        const componentDir = $(this).find(".componentDir").val();
        const componentId = $(this).find(".componentId").val();
        const componentContainer = $(this).find(".componentContainer").val();
        const componentClassName = $(this).find(".componentClassName").val();
        const componentChildren = $(this).find(".componentChildren").val();

        components[componentName] = {
          dir: componentDir.endsWith("/")
            ? componentDir
            : componentDir
            ? componentDir + "/"
            : "",
          id: componentId,
          container: componentContainer,
          className: componentClassName,
          children: componentChildren,
        };
      });

      let genConfig = {
        [viewName]: {
          role: "parent",
          dir: dir || `cleint/views/${viewName}/`,
          functionFile: viewName,
          render: render,
          originBurst: {},
          container: container,
          components: components,
        },
      };

      if (htmlPath) genConfig[viewName].htmlPath = htmlPath;
      if (cssPath) genConfig[viewName].cssPath = cssPath;

      return genConfig;
    }

    function processConfig(viewName, dir, configString) {
      if (!viewName) {
        alert("viewName is empty");
        window.updateComponent(
          vanillaPromise,
          "[processConfig] Error: viewName is empty",
          "canvasresult",
          ".config-result"
        );
        return;
      }

      let jsFunctionStringBuild = `window.frozenVanilla("${viewName}", function(vanillaPromise) {\n\n`;
      jsFunctionStringBuild += `  // Your function logic here\n\n`;
      jsFunctionStringBuild += `});\n\n`;

      let jsFileHTML = `//Create a js file named ${viewName}.js in directory path: ${dir}<br/><br/>
      ${jsFunctionStringBuild}`;

      const configHTML = `//The 'canvasresult' component was updated and cached using 
//<em>window.updateComponent(vanillaPromise, htmlResults, componentKey, target || undefined)</em>
//The helper function used vanillaPromise to find the component config in the schema by 'canvasresult' param,
//then updated the optionally set '.config-result' target.<br/><br/>
//Create a new js file named ${viewName}Config.js in the schemas folder with the following code:<br/><br/>
${configString}`;

      let htmlResults = {
        //start: -1, //optional, defaults to 0 behaviour,
        //clear: false, //optional, defaults to true
        //position: "after", //optional only on null
        tag: "pre", //optional
        html: [configHTML, jsFileHTML],
      };

      window.updateComponent(
        vanillaPromise,
        htmlResults,
        "canvasresult",
        ".config-result"
      );
    }

    function buildConfigString(config) {
      try {
        const functionName = Object.keys(config)[0];
        const passedConfig = config[functionName];
        const viewName = functionName.toLowerCase();

        let functionString = `window.frozenVanilla("${functionName}", function(sharedParts) {\n\n`;
        functionString += `  let ${viewName}Config = {};\n`;
        functionString += `  let passedConfig = ${JSON.stringify(
          passedConfig,
          null,
          2
        )};\n\n`;
        functionString += `  ${viewName}Config = { ...vanillaConfig("${functionName}", passedConfig) };\n\n`;
        functionString += `  return ${viewName}Config;\n});\n\n`;

        return functionString.replace(/functionName/g, viewName);
      } catch (error) {
        window.updateComponent(
          vanillaPromise,
          "[configStringBuild] Error: " + error,
          "canvasresult",
          ".config-result"
        );
        throw error; // Ensure the error is rethrown so the caller knows it occurred
      }
    }

    let finalConfigs = [];

    nodes.forEach((node) => {
      try {
        let nodeConfig = generateConfig(viewName);
        let sharedParts = {};
        let mergedConfig = { ...nodeConfig, ...sharedParts };
        finalConfigs.push(mergedConfig);
      } catch (error) {
        window.updateComponent(
          vanillaPromise,
          "[generateConfig] Error: " + error,
          "canvasresult",
          ".config-result"
        );
      }
    });

    let configString = "";

    finalConfigs.forEach((config) => {
      configString += buildConfigString(config);
    });

    try {
      processConfig(viewName, dir, configString);
    } catch (error) {
      window.updateComponent(
        vanillaPromise,
        "[processConfig] Error: " + error,
        "canvasresult",
        ".config-result"
      );
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(configString).then(
        function () {
          alert("Config copied to clipboard!");
          console.log("Copying to clipboard was successful!");
        },
        function (err) {
          window.updateComponent(
            vanillaPromise,
            "[clipboard] Error: " + err,
            "canvasresult",
            ".config-result"
          );
          console.error("Could not copy text: ", err);
        }
      );
    }
  }
});
