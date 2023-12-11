// challenge.js

window.level1 =  function level1(renderSchema, originBurst, runFunction) {

    if (window.runFunction === 'functionBurst') {

        let passedFunction = window.renderSchema.customFunctions.level1;

        miniDOM(passedFunction, initView);

        function initView(){
            const solveButton = document.getElementById('solveButton');
            solveButton.addEventListener('click', yo);

        
        }

   function yo(){
    alert('hi')
   }

    }
};

// Ensure to trigger this function when level1 view is called
if (typeof window.level1 === 'function') {
    window.level1(window.renderSchema, window.originBurst, 'functionBurst');
}