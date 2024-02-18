function gen() {


          

             window.genView = function genView() {
                let button = document.getElementById('create-config');

                button.addEventListener('click', function () {
                    window.nodeConfigBuild();                
                });
            
                

            }

  

}


//move this to its own functionFile, this gen view might get more complex
window.nodeConfigBuild = function nodeConfigBuild() {

    // Find the container for the draggable nodes
    const canvas = document.querySelector('#vanillaFlowCanvas');
    const nodes = canvas.querySelectorAll('.parent-node');

    let configString = "";

    nodes.forEach(node => {
        const nodeName = node.querySelector('[name="functionName"]').value;
        const dir = node.querySelector('[name="dir"]').value;
        const functionFile = nodeName;
        const originBurst = node.querySelector('[name="originburst"]').value;
        const htmlPath = dir + node.querySelector('[name="htmlPath"]').value;
        const cssPath = dir + node.querySelector('[name="cssPath"]').value;
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
