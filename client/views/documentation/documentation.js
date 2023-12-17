// challenge.js

window.documentation = async function documentation() {

    if (window.runFunction === 'functionBurst') {



     
        window.miniDOM(window.documentationConfig(), 'documentation', 'documentation', functionView);


        function functionView() {

            window.componentDOM('client/components/buttons/generatebutton.html', 'client/components/buttons/buttons.css', 'button-wrapper')


        }
    

    } else {
        console.warn("documentation didn't run: runFunction not set, halting execution.");
    }
};

