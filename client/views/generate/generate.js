ë.frozenVanilla("generate", function (vanillaPromise) {
  ë.logSpacer(vanillaPromise.this + " ran");

  // DOM Helper Functions
  const getDOMElement = (selector) => document.querySelector(selector);
  const getDOMElements = (selector) => document.querySelectorAll(selector);
  const getValue = (selector) => getDOMElement(selector)?.value || "";
  const setValue = (selector, value) => {
    const element = getDOMElement(selector);
    if (element) element.value = value;
  };

  // Syntax highlighting helper
  function addSyntaxHighlighting(code) {
    // Escape HTML entities first to prevent double-encoding
    let highlighted = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Apply highlighting in careful order to avoid conflicts
    // Use negative lookbehind/ahead to avoid matching inside already highlighted spans

    highlighted = highlighted
      // String literals (before everything else to protect content)
      .replace(/"([^"]*)"/g, '<span class="syntax-string">"$1"</span>')
      .replace(/'([^']*)'/g, "<span class=\"syntax-string\">'$1'</span>")

      // Special ë object (before function names)
      .replace(/\bë\b/g, '<span class="syntax-special">ë</span>');

    // Now apply patterns that need to avoid already highlighted content
    // Split by existing spans to work only on unhighlighted text
    // Use a more robust split that handles multiline spans better
    const parts = highlighted.split(
      /(<span[^>]*>(?:[^<]|<(?!\/span>))*<\/span>)/g
    );

    for (let i = 0; i < parts.length; i++) {
      // Only process parts that are not already highlighted (odd indices are spans)
      if (i % 2 === 0) {
        parts[i] = parts[i]
          // Comments (process in Phase 2 to avoid conflicts)
          .replace(/(^\/\/.*$)/gm, '<span class="syntax-comment">$1</span>')
          .replace(
            /(\s)(\/\/.*$)/gm,
            '$1<span class="syntax-comment">$2</span>'
          )
          // Keywords
          .replace(
            /\b(function|let|const|var|return|if|else|for|while|try|catch|async|await|class|extends|import|export|default)\b/g,
            '<span class="syntax-keyword">$1</span>'
          )
          // Function names
          .replace(
            /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g,
            '<span class="syntax-function">$1</span>('
          )
          // Object properties
          .replace(
            /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g,
            '<span class="syntax-property">$1</span>:'
          )
          // Numbers
          .replace(
            /\b(\d+(?:\.\d+)?)\b/g,
            '<span class="syntax-number">$1</span>'
          )
          // Boolean and null
          .replace(
            /\b(true|false|null|undefined)\b/g,
            '<span class="syntax-boolean">$1</span>'
          )
          // Brackets and operators
          .replace(/([{}();,])/g, '<span class="syntax-punctuation">$1</span>');
      }
    }

    // Rejoin the parts
    highlighted = parts.join("");

    return highlighted;
  }

  // Sub-DOM management
  let subDomClicks = 0;

  function handleAddSubDOM(event) {
    subDomClicks++;
    event.preventDefault();

    const clickedButton = event.target;
    const template =
      clickedButton.parentElement.querySelector(".componentTemplate");

    if (!template) return;

    if (subDomClicks === 1) {
      template.style.display = "flex";
    } else {
      const newSubDom = template.cloneNode(true);
      template.parentElement.insertBefore(newSubDom, template);
      newSubDom.style.display = "flex";
    }
  }

  function handleCreateConfig(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    buildConfigFromForm();
  }

  // Event listeners
  getDOMElements(".addSubDOM").forEach((button) => {
    button.addEventListener("click", handleAddSubDOM);
  });

  const createConfigButton = getDOMElement("#create-config");
  if (createConfigButton) {
    createConfigButton.removeEventListener("click", handleCreateConfig);
    createConfigButton.addEventListener("click", handleCreateConfig);
  }

  // Form data extraction
  function getFormData() {
    return {
      viewName: getValue("#viewName"),
      dir: getValue("#dir"),
      staticDOM: getValue("#requireHtmlCss"),
      container: getValue("#container"),
      render: getValue("#render") || "pause",
      cssPath: getValue("#cssPath"),
    };
  }

  function normalizeStaticDOM(staticDOM) {
    if (staticDOM === "yes") return true;
    return undefined;
  }

  function getContainerName(staticDOM, container, viewName) {
    if (staticDOM === true) {
      return container || `${viewName}-container`;
    }
    return undefined;
  }

  // Validation
  function validateFormData(formData) {
    const validations = [
      {
        condition: !formData.viewName || formData.viewName.trim() === "",
        message: "viewName is required",
      },
    ];

    for (const { condition, message } of validations) {
      if (condition) {
        showError(`[validation] Error: ${message}`);
        return false;
      }
    }
    return true;
  }

  function showError(message) {
    ë.updateComponent(
      vanillaPromise,
      { tag: "pre", html: [message] },
      "canvasresult",
      ".config-result",
      scrollToElement(".config-result")
    );
  }

  //move this to its own functionName, this generate view might get more complex
  function buildConfigFromForm() {
    const configCanvas = getDOMElement(".config-canvas");
    const nodes = configCanvas.querySelectorAll(".parentnode");
    const formData = getFormData();

    // Normalize form data
    const staticDOM = normalizeStaticDOM(formData.staticDOM);
    const container = getContainerName(
      staticDOM,
      formData.container,
      formData.viewName
    );
    const role = "parent";

    // Validate input
    if (!validateFormData(formData)) {
      return;
    }

    // Generate and process config
    try {
      const configString = generateConfigString(formData.viewName, {
        ...formData,
        staticDOM,
        container,
        role,
        nodes,
      });

      processGeneratedConfig(
        formData.viewName,
        formData.dir,
        configString,
        role
      );
    } catch (error) {
      showError(`[buildConfig] Error: ${error}`);
    }
  }

  // Component extraction
  function extractComponentsFromDOM() {
    const components = {};
    const templates = getDOMElements(".componentTemplate");

    templates.forEach((template) => {
      const componentName = template.querySelector(".componentName")?.value;
      if (!componentName) return; // Skip empty templates

      const componentDir = template.querySelector(".componentDir")?.value || "";
      const componentId = template.querySelector(".componentId")?.value;
      const componentContainer = template.querySelector(
        ".componentContainer"
      )?.value;
      const componentClassName = template.querySelector(
        ".componentClassName"
      )?.value;
      const componentChildren =
        template.querySelector(".componentChildren")?.value;

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

    return components;
  }

  function createViewConfig(viewName, options) {
    const { role, render, staticDOM, container } = options;
    const components = extractComponentsFromDOM();

    return {
      [viewName]: {
        role: role,
        render: render,
        originBurst: {},
        fetchDOM: staticDOM,
        container: container,
        components:
          Object.entries(components).length > 0 ? components : undefined,
      },
    };
  }

  function generateConfigString(viewName, options) {
    const { nodes } = options;
    let finalConfigs = [];

    nodes.forEach(() => {
      try {
        const nodeConfig = createViewConfig(viewName, options);
        const sharedParts = {};
        const mergedConfig = { ...nodeConfig, ...sharedParts };
        finalConfigs.push(mergedConfig);
      } catch (error) {
        showError(`[generateConfig] Error: ${error}`);
      }
    });

    let configString = "";
    finalConfigs.forEach((config) => {
      configString += buildConfigFileString(config);
    });

    return configString;
  }

  async function processGeneratedConfig(viewName, dir, configString, role) {
    if (!viewName) {
      showError("[processConfig] Error: viewName is empty");
      return;
    }

    const jsFunctionStringBuild =
      `ë.frozenVanilla("${viewName}", function(vanillaPromise) {\n\n` +
      `// Your function logic here\n\n` +
      `    console.log(vanillaPromise.this + "is ready and running")\n\n` +
      `});\n\n`;

    let directory;
    switch (role) {
      case "parent":
        directory = `client/views/${viewName}/`;
    }

    const jsFileHTML =
      `//STEP 2: 
//Create a js file named ${viewName}.js in directory path: ${directory}<br/><br/>` +
      jsFunctionStringBuild;

    const htmlResults = {
      clear: true,
      tag: "div",
      classNames: "syntax-highlighted-code",
      html: [
        `<pre class="code-block" data-language="javascript">${configString}</pre>`,
        `<pre class="code-block" data-language="javascript">${jsFileHTML}</pre>`,
      ],
    };

    // Function to apply syntax highlighting after DOM update
    const applySyntaxHighlighting = () => {
      const codeBlocks = document.querySelectorAll(
        '.code-block[data-language="javascript"]'
      );
      console.log("Found code blocks:", codeBlocks.length);

      codeBlocks.forEach((block, index) => {
        if (!block.dataset.highlighted) {
          console.log(`Processing block ${index}`);
          const originalText = block.textContent;

          // Try a different approach: create a document fragment with proper DOM elements
          const fragment = document.createDocumentFragment();

          // Split by lines and process each line
          const lines = originalText.split("\n");
          lines.forEach((line, lineIndex) => {
            if (lineIndex > 0) {
              fragment.appendChild(document.createTextNode("\n"));
            }

            if (line.trim().startsWith("//")) {
              // Create comment span
              const commentSpan = document.createElement("span");
              commentSpan.className = "syntax-comment";
              commentSpan.textContent = line;
              fragment.appendChild(commentSpan);
            } else {
              // For now, process line by line - we can enhance this
              const processedLine = createHighlightedLine(line);
              fragment.appendChild(processedLine);
            }
          });

          // Clear block and append fragment
          block.innerHTML = "";
          block.appendChild(fragment);

          block.dataset.highlighted = "true";
          // Set nonce for dynamically added HTML content
          block.setAttribute("nonce", ë.nonceBack());
        }
      });
    };

    // Helper function to create highlighted line
    function createHighlightedLine(line) {
      const fragment = document.createDocumentFragment();

      // Simple approach: highlight keywords, strings, etc.
      let remaining = line;
      let processed = "";

      // For now, let's try a simple approach
      const keywords = [
        "function",
        "let",
        "const",
        "var",
        "return",
        "if",
        "else",
        "for",
        "while",
        "try",
        "catch",
        "async",
        "await",
        "class",
        "extends",
        "import",
        "export",
        "default",
      ];

      // Split by words and spaces
      const parts = line.split(/(\s+)/);

      parts.forEach((part) => {
        if (keywords.includes(part)) {
          const span = document.createElement("span");
          span.className = "syntax-keyword";
          span.textContent = part;
          fragment.appendChild(span);
        } else if (part === "ë") {
          const span = document.createElement("span");
          span.className = "syntax-special";
          span.textContent = part;
          fragment.appendChild(span);
        } else if (part.match(/^["'].*["']$/)) {
          const span = document.createElement("span");
          span.className = "syntax-string";
          span.textContent = part;
          fragment.appendChild(span);
        } else if (part.match(/\w+\s*\(/)) {
          const span = document.createElement("span");
          span.className = "syntax-function";
          span.textContent = part;
          fragment.appendChild(span);
        } else if (part.match(/\w+\s*:/)) {
          const span = document.createElement("span");
          span.className = "syntax-property";
          span.textContent = part;
          fragment.appendChild(span);
        } else if (part.match(/^\d+(\.\d+)?$/)) {
          const span = document.createElement("span");
          span.className = "syntax-number";
          span.textContent = part;
          fragment.appendChild(span);
        } else if (["true", "false", "null", "undefined"].includes(part)) {
          const span = document.createElement("span");
          span.className = "syntax-boolean";
          span.textContent = part;
          fragment.appendChild(span);
        } else if (part.match(/[{}();,]/)) {
          const span = document.createElement("span");
          span.className = "syntax-punctuation";
          span.textContent = part;
          fragment.appendChild(span);
        } else {
          // Regular text
          fragment.appendChild(document.createTextNode(part));
        }
      });

      return fragment;
    }

    try {
      await ë.updateComponent(
        vanillaPromise,
        htmlResults,
        "canvasresult",
        ".config-result",
        scrollToElement(".config-result"),
        true
      );

      // Apply syntax highlighting after DOM update
      setTimeout(applySyntaxHighlighting, 100);

      // Add clipboard buttons after highlighting is complete
      setTimeout(() => {
        const codeBlocks = document.querySelectorAll(
          '.code-block[data-language="javascript"]'
        );
        console.log(
          `Adding clipboard buttons to ${codeBlocks.length} code blocks`
        );

        codeBlocks.forEach((block, index) => {
          ë.addClipboardButton(block, index);
        });
      }, 150);

      // Update component with highlighted version for caching
      setTimeout(async () => {
        try {
          const configResultElement = document.querySelector(".config-result");
          if (configResultElement) {
            const highlightedHTML = ë.sanitizeVanillaDOM(
              configResultElement.innerHTML
            );

            await ë.updateComponent(
              vanillaPromise,
              {
                clear: true,
                tag: "div",
                classNames: "syntax-highlighted-code",
                html: [highlightedHTML],
              },
              "canvasresult",
              ".config-result",
              null,
              true
            );
          }
        } catch (error) {
          console.error("[updateHighlighted] Error:", error);
        }
      }, 200);

      await displayConfigStatus(viewName);
    } catch (error) {
      showError(`[processConfig] Error: ${error}`);
    }
  }

  async function displayConfigStatus(viewName) {
    try {
      const cacheCheckResult = JSON.parse(localStorage.getItem("originBurst"));
      const verboseLog = JSON.stringify(
        cacheCheckResult.componentBurst.verbose
      );

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
          classNames: "config-status-output",
          html: [
            `[vanillaBurst]Success: Generated ${viewName}Config.js and ${viewName}.js code. \n` +
              `[verbose = true]\n` +
              `[vanillaBurst] componentBurst Log: 
                  ${verboseLog}\n` +
              `[vanillaBurst] Manual Trace:\n` +
              `${configHTML}`,
          ],
        },
        "canvasresult",
        ".config-code"
      );
    } catch (error) {
      console.error("Error in displayConfigStatus:", error);
    }
  }

  function buildConfigFileString(config) {
    try {
      const functionName = Object.keys(config)[0];
      const passedConfig = config[functionName];
      const viewName = functionName.toLowerCase();
      const passedConfigString = stringifyObject(passedConfig, 2);

      const codeTemplate = `//STEP 1: 
//Create a new js file named ${viewName}Config.js in the schemas folder with the following code:

ë.frozenVanilla("${functionName}Config", function(sharedParts) {

let ${viewName}Config = {};
let passedConfig = ${passedConfigString};

${viewName}Config = { ...vanillaConfig("${functionName}", passedConfig) };

return ${viewName}Config;
});

`.replace(/functionName/g, viewName);

      return codeTemplate;
    } catch (error) {
      showError("[configStringBuild] Error: " + error);
      throw error;
    }
  }

  // Clipboard functionality

  function scrollToElement(target, callback) {
    try {
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

  // Utility functions
  function scrollToElement(target, callback) {
    try {
      const element = document.querySelector(target);

      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }

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
});
