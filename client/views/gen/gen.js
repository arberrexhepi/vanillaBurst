// final.js

window.gen = async function gen(renderSchema, originBurst, runFunction) {
 
 if (window.runFunction === "functionBurst") {
        let htmlPath = 'client/views/gen/components/';
        let cssPath = 'client/views/gen/components/';

        //should introduce a domChain ..?
         window.miniDOM(window.genConfig(), 'gen', genView);
        
        
         // the component below is not ready
         //window.componentDOM(htmlPath+'function-node.html', cssPath+'', 'function-node', 'function-node');
       


        async function genView(){
            
           
            window.componentDOM('client/components/buttons/docbutton.html', 'client/components/buttons/buttons.css', 'button-wrapper', 'docbutton')

            window.componentDOM(htmlPath+'parent-node.html', cssPath+'', 'parent-node', 'parent-node');
            
        }

       
    
    
    } else {
        console.warn("gen view: runFunction not set, halting execution.");
    }
};

//move this to its own functionFile, this gen view might get more complex
window.nodeConfigBuild = function nodeConfigBuild(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    // Find the container for the draggable nodes
    const canvas = document.querySelector('#vanillaFlowCanvas');
    const nodes = canvas.querySelectorAll('.parent-node');

    let configString = "";

    nodes.forEach(node => {
        const nodeName = node.querySelector('[name="functionName"]').value;
        const dir = node.querySelector('[name="dir"]').value;
        const functionFile = nodeName;
        const originBurst = node.querySelector('[name="originburst"]').value;
        const htmlPath = dir+node.querySelector('[name="htmlPath"]').value;
        const cssPath = dir+node.querySelector('[name="cssPath"]').value;
        const targetDOM = node.querySelector('[name="targetDOM"]').value;

        // Construct the function string for each node
        configString += `
window.${functionFile}Config = function ${functionFile}Config(sharedParts) {
    let ${functionFile}Config = {};
    passedConfig = {
        '${functionFile}': {
            'role': 'parent',
            'dir': '${dir}',
            'functionFile': '${functionFile}',
            'render': 'pause',
            'originBurst': ${originBurst},
            'htmlPath': '${htmlPath}',
            'cssPath': '${cssPath}',
            'targetDOM': '${targetDOM}'
        }
        ...sharedParts

    };
    ${functionFile}Config = {...vanillaConfig('${functionFile}', passedConfig)};
    return ${functionFile}Config;
};
        `;
    });

    console.log("Generated vanillaBurst Config:", configString);

    // Optional: Copy the config to clipboard
    const textArea = document.createElement("textarea");
    textArea.value = configString;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();

    alert("Config copied to clipboard!");
}

//define functions here