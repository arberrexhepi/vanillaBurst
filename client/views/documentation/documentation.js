// challenge.js

window.documentation = async function documentation() {

    if (window.runFunction === 'functionBurst') {

        window.domFunction='documentation'
         window.miniDOM(window.documentationConfig(), domFunction, docView);
         window.componentDOM('client/components/buttons/generatebutton.html', 'client/components/buttons/buttons.css', 'button-wrapper', 'docbutton')


        function docView() {
        


        }

    }
};

// Ensure to trigger this function when level1 view is called
if (typeof window.documentation=== 'function') {
    window.level1(window.renderSchema, window.originBurst, 'functionBurst');
}