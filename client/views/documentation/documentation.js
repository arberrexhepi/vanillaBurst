// challenge.js

window.documentation = async function documentation() {

    if (window.runFunction === 'functionBurst') {

        window.domFunction='documentation'
     
        window.miniDOM(window.documentationConfig(), domFunction, functionView);


        function functionView() {
        
            window.componentDOM('client/components/buttons/generatebutton.html', 'client/components/buttons/buttons.css', 'button-wrapper', 'docbutton')


        }

    } else {
        console.warn("documentation didn't run: runFunction not set, halting execution.");
    }
};

