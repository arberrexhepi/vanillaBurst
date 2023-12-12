// challenge.js

window.level1 = async function level1() {

    if (window.runFunction === 'functionBurst') {

        window.miniDOM(window.level1Config(passedConfig), 'level1', initView);


        function initView() {
            const solveButton = document.getElementById('solveButton');
            solveButton.addEventListener('click', yo);


        }

        function yo() {
            alert('hi')
            console.log('ran from shared function 2');

        }

    }
};

// Ensure to trigger this function when level1 view is called
if (typeof window.level1 === 'function') {
    window.level1(window.renderSchema, window.originBurst, 'functionBurst');
}