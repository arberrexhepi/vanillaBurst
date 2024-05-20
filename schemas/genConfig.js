window.frozenVanilla("genConfig", function (sharedParts) {
  let genConfig = {};

  let seo = {
    title: "Generate vanillaBurst App Views",
    description:
      "vanillaBurst assists with planning and creation of your app's views. Streamline your JS projects with ease and efficiency.",
    keywords: [
      "vanillaBurst",
      "JavaScript",
      "Plugin",
      "Standalone",
      "Project Builder",
      "Server Interaction",
      "State Caching",
      "Load Balancing",
    ],
    author: "vanillaBurst Team",
    image: "URL to the image for social sharing", // Replace with the actual URL of the image
    url: "URL of the page", // Replace with the actual URL of the page
    siteName: "vanillaBurst",
  };

  let passedConfig = {
    gen: {
      role: "parent",
      dir: "client/views/gen/",
      functionFile: "gen",
      render: "pause",
      originBurst: "gen",
      htmlPath: "client/views/gen/gen.html",
      cssPath: "client/views/gen/gen.css",
      container: "viewbox",
      ...{ seo: seo },
      components: {
        myButtonName: {
          dir: "buttons/",
          id: "docbutton",
          container: "doc-button_wrapper",
          className: "button round",
          children: `
          <button class="headerbutton mydocbutton" data-route="documentation">View Documentation</button>
            `,
          eventHandlers: "submit:preventDefault",
        },

        parentnode: {
          parent: true,
          id: "parentnode",
          container: "config-canvas",
          className: "parentnode genform",
          children: `
          <h3>Parent Node Configuration</h3>
          <small>Name Convention: viewnameConfig.js</small>
          <br /><br />
          <form id="parentConfigForm">
              <div class="fields">
          
                  <input type="hidden" id="role" name="role" value="parent"><br />
          
                  <label for="functionName">View Name:</label><br />
                  <input type="text" id="functionName" name="functionName" placeholder="e.g., myFunction"><br />
          
                  <label for="directory">Directory:</label><br />
                  <input type="text" id="directory" name="dir" placeholder="e.g., client/views/myFunction/"><br />
          
                  <label for="renderMode">Render Mode: 'pause' </label><br />
                  <small>Change manually to 'burst' if needed</small>
                  <br /> <br />
          
                  <label for="originburst">Origin Burst:</label><br />
                  <input type="text" id="originburst" name="originburst" placeholder="e.g., a custom object"><br />
          
                  <label for="htmlPath">HTML Path:</label><br />
                  <input type="text" id="htmlPath" name="htmlPath"
                      placeholder="e.g., myFunction.html (relative to Directory above)"><br />
          
                  <label for="cssPath">CSS Path:</label><br />
                  <input type="text" id="cssPath" name="cssPath"
                      placeholder="e.g., myFunction.css (relative to Directory above)"><br />
          
                  <label for="targetDOM">Target DOM:</label><br />
                  <input type="text" id="targetDOM" name="targetDOM" placeholder="e.g., someDOMId"><br /><br />
          
          
                  <fieldset class="subDOMTemplate" style="display: none">
                      <legend>Sub DOM Configuration</legend>
                      <div class=" subDOMFieldsContainer" ">
                              <label for=" htmlPath">HTML Path:</label><br />
                          <input type="text" name="subDOMHtmlPath" placeholder="e.g., path"><br />
          
                          <label for="cssPath">CSS Path:</label><br />
                          <input type="text" name="subDOMCssPath" placeholder="e.g., path"><br />
          
                          <label for="targetDOM">Target DOM:</label><br />
                          <input type="text" name="subDOMTargetDOM" placeholder="e.g., id"><br />
          
                          <label for="htmlAttrs">HTML Attributes:</label><br />
                          <fieldset id="subDOMTemplate">
                              <!-- existing fields... -->
          
                              <h3>HTML Attributes:</h3>
          
                              <label for="id">ID:</label><br />
                              <input type="text" name="subDOMHtmlAttrId"><br />
          
                              <label for="cssclass">CSS Class:</label><br />
                              <input type="text" name="subDOMHtmlAttrCssClass"><br />
                          </fieldset>
                      </div>
                  </fieldset>
                  <label for="subDOM">Sub DOM:</label><br />
                  <button id="subDOM" class="addSubDOM" name="subDOM">Add Sub DOM</button><br /><br />
          
          
              </div>
              <button id="create-config">Create Config</button>
          
          </form>
            `,
          eventHandlers: "submit:preventDefault",
        },

        functionnode: {
          parent: true,
          id: "functionnode",
          container: "config-canvas",
          className: "genform",
          children: `
          <h3>View Node</h3>
          <label for="landing">Landing:</label>
          <input type="text" id="landing" name="landing">
          <div class="scripts">
              <h4>Scripts</h4>
              <div class="script-inputs">
                  <label for="script">Script:</label>
                  <input type="text" id="script" name="script[]">
              </div>
              <button id="add-script">Add Script</button>
          </div>
          <label for="preloader">Preloader:</label>
          <input type="text" id="preloader" name="preloader">
          `,
        },
        canvasresult: {
          parent: true,
          id: "config-result",
          container: "config-canvas",
          className: "config-result",
          children: "",
        },
      },
    },
    ...sharedParts,
  };

  genConfig = { ...vanillaConfig("gen", passedConfig) };

  window.seo = seo;

  return genConfig;
});
