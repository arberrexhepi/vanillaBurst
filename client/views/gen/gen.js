ë.frozenVanilla("gen", function (vanillaPromise) {
  console.log(vanillaPromise.this + " ran");

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

  $("#create-config")
    .off()
    .on("click", function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
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
    const validations = [
      {
        condition: !viewName || viewName.trim() === "",
        message: "viewName is required",
      },
    ];

    for (const { condition, message } of validations) {
      if (condition) {
        ë.updateComponent(
          vanillaPromise,
          { tag: "pre", html: [`[validation] Error: ${message}`] },
          "canvasresult",
          ".config-result",
          scrollToElement(".config-result")
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
          dir: dir || `client/views/${viewName}/`,
          functionFile: viewName,
          render: render,
          originBurst: {},
          container: container,
          components: components,
        },
      };

      return genConfig;
    }

    async function processConfig(viewName, dir, configString) {
      if (!viewName) {
        //alert("viewName is empty");
        ë.updateComponent(
          vanillaPromise,
          {
            clear: false,
            tag: "pre",
            html: ["[processConfig] Error: viewName is empty"],
          },
          "canvasresult",
          "#configlog"
        );
        return;
      }

      let jsFunctionStringBuild = `ë.frozenVanilla("${viewName}", function(vanillaPromise) {\n\n`;
      jsFunctionStringBuild += `    // Your function logic here\n\n`;
      jsFunctionStringBuild += `    console.log(vanillaPromise.this + "is ready and running")\n\n`;
      jsFunctionStringBuild += `});\n\n`;

      let jsFileHTML =
        `//Create a js file named ${viewName}.js in directory path: ${dir}<br/><br/>` +
        jsFunctionStringBuild;

      let htmlResults = {
        position: 1,
        //insert: "after",
        clear: true,
        tag: "pre",
        html: [configString, jsFileHTML],
      };

      async function configStatusOutput(viewName) {
        let myresult = await new Promise((resolve, reject) => {
          let cacheCheckResult = JSON.parse(
            localStorage.getItem("originBurst")
          );
          let yoo = JSON.stringify(cacheCheckResult.componentBurst.verbose);

          resolve(yoo);
        });

        const configHTML =
          `//The 'canvasresult' component was updated and cached\n` +
          `//ran ë.updateComponent(vanillaPromise, htmlResults, componentKey, target, verbose=true)\n` +
          `//The helper function used vanillaPromise to find the component config in the schema by 'canvasresult' param,\n` +
          `//then updated the optionally set '.config-result' target.<br/><br/>\n`;
        ë.updateComponent(
          vanillaPromise,
          {
            clear: false,
            tag: "pre",
            html: [
              `[vanillaBurst]Success: Generated ${viewName}Config.js and ${viewName}.js code. \n` +
                `[verbose = true]\n` +
                `[vanillaBurst] componentBurst Log: 
                  ${myresult}\n` +
                `[vanillaBurst] Manual Trace:\n` +
                `${configHTML}`,
            ],
          },
          "canvasresult",
          "#configlog.config-result"
        );
      }

      new Promise(async (resolve, reject) => {
        try {
          await ë.updateComponent(
            vanillaPromise,
            htmlResults,
            "canvasresult",
            ".config-result",
            scrollToElement(".config-result"),
            true
          );
          resolve();
        } catch (error) {
          reject(error);
        }
      })
        .then(() => {
          configStatusOutput(viewName);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    function buildConfigString(config) {
      try {
        const functionName = Object.keys(config)[0];
        const passedConfig = config[functionName];
        const viewName = functionName.toLowerCase();
        const passedConfigString = stringifyObject(passedConfig);

        let functionString = `
        //Create a new js file named ${viewName}Config.js in the schemas folder with the following code:<br/><br/>

ë.frozenVanilla("${functionName}Config", function(sharedParts) {

  let ${viewName}Config = {};
  let passedConfig = ${passedConfigString};

  ${viewName}Config = { ...vanillaConfig("${functionName}", passedConfig) };

  return ${viewName}Config;
});

`;

        return functionString.replace(/functionName/g, viewName);
      } catch (error) {
        ë.updateComponent(
          vanillaPromise,
          { tag: "pre", html: ["[configStringBuild] Error: " + error] },
          "canvasresult",
          ".config-result"
        );
        throw error;
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
        ë.updateComponent(
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
      ë.updateComponent(
        vanillaPromise,
        "[processConfig] Error: " + error,
        "canvasresult",
        ".config-result"
      );
    }

    //Clipboar support, not tested yet
    // if (navigator.clipboard) {
    //   navigator.clipboard.writeText(configString).then(
    //     function () {
    //       //   alert("Config copied to clipboard!");
    //       console.log("Copying to clipboard was successful!");
    //     },
    //     function (err) {
    //       ë.updateComponent(
    //         vanillaPromise,
    //         "[clipboard] Error: " + err,
    //         "canvasresult",
    //         ".config-result"
    //       );
    //       console.error("Could not copy text: ", err);
    //     }
    //   );
    // }

    function scrollToElement(target, callback) {
      try {
        const prefix = target.charAt(0);

        // Get the element based on whether it's a class or id
        const element = document.querySelector(target);

        // If the element exists, scroll to it
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }

        // If a callback function was provided, call it
        if (callback && typeof callback === "function") {
          callback();
        }
      } catch (error) {
        throw new Error("scrollToElement: " + error);
      }
    }

    function stringifyObject(obj, indent = 2) {
      const str = JSON.stringify(obj, null, indent);
      return str.replace(/"([^"]+)":/g, "$1:");
    }
  }
});
