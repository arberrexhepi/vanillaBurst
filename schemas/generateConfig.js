ë.frozenVanilla("generateConfig", function () {
  let seo = {
    title: "Generate Configs",
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
    image: ë.baseUrlImages + "wordmark.png", // Replace with the actual URL of the image
    url: ë.domainUrl + ë.stateTagPath, // Replace with the actual URL of the page, currently out of scope, will fix!
    siteName: "vanillaBurst",
  };

  let generateConfig = {
    generate: {
      role: "parent",
      fetchDOM: true,
      render: "pause",
      originBurst: "generate",
      container: "viewbox",
      ...{ seo: seo },
      components: {
        myButtonName: {
          dir: "buttons/",
          id: "docbutton",
          container: "doc-button_wrapper",
          classNames: "button round",
          children: `
            <blockquote>
            <button class="headerbutton mydocbutton" data-route="documentation"> Documentation</button>
            </blockquote>
              `,
          eventHandlers: "submit:preventDefault",
        },

        parentnode: {
          parent: true,
          id: "parentnode",
          container: "config-canvas",
          classNames: "parentnode genform card hover",
          children: `
            <form id="parentConfigForm">
            <legend class="form-title">Landing Config</legend>
            <small class="form-description">Name Convention: viewnameConfig.js</small>
  
            <div class="fields">
                <label for="viewName">Landing Name:</label><small>(required)</small>
                <input type="text" id="viewName" placeholder="Enter view name, ie: home, products, etc" name="viewName" required><br>
    
                <label for="render">Render:</label>
                <input type="text" id="render" name="render" value="pause"><br>
    
                <label for="requireHtmlCss">Will this landing require HTML and CSS?</label><br/>
                <select id="requireHtmlCss" name="requireHtmlCss">
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select><br>
    
                <label for="container">Container:</label><small>(required if HTML PATH)</small>
                <input type="text" id="container" name="container" placeholder="Enter Container Name"><br>
    
                <fieldset class="componentTemplate">
                  <div class="componentTemplate-container">
                    <legend>Component Configuration</legend>
                    <div class="subDOMFieldsContainer">
                        <label for="componentName">Name:</label> <small>(required)</small>
                        <input type="text" class="componentName" name="componentName" placeholder="Enter Component Name"><br>
    
                        <label for="componentDir">Directory:</label>
                        <input type="text" class="componentDir" name="componentDir" placeholder="Enter Component Directory"><br>
    
                        <label for="componentId">ID:</label><small>(required)</small>
                        <input type="text" class="componentId" name="componentId" required placeholder="Enter Component ID"><br>
    
                        <label for="componentContainer">Container:</label><small>(required)</small>
                        <input type="text" class="componentContainer" name="componentContainer" required placeholder="Enter Component Container"><br>
    
                        <label for="componentClassName">Class Name:</label><small>(required)</small>
                        <input type="text" class="componentClassName" name="componentClassName" required placeholder="Enter Component Class Name"><br>
    
                        <label for="componentChildren">HTML Content:</label>
                        <textarea class="componentChildren" name="componentChildren" placeholder="Enter Component Children"></textarea><br>
                    </div>
                    </div>
                </fieldset>
    
                <button id="subDOM" class="addSubDOM" name="subDOM">Add Dynamic Component</button><br><br>
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
          classNames: "genform card hover",
          children: `
            <form id="parentConfigForm">
            <legend class="form-title">Function Config</legend>
            <small class="form-description">Info: This prepares a config for a function. These can also serve as static components or include their own components.</small><br/>
            <small class="help-card">Update Pending</small>
            `,
        },
        canvasresult: {
          // cache: false,
          parent: true,
          id: "canvasresult",
          container: "config-canvas",
          classNames: "canvasresult-container",
          children: `<pre id="configlog" class="config-result">[vanillaBurst] Component: 'canvasresult'. Generate a config to see the resulting code </pre>
          <pre class="config-code"></pre>`,
        },
      },
    },
  };

  return (generateConfig = { ...vanillaConfig("generate", generateConfig) });
});
