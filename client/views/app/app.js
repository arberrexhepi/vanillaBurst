window.app = async function app() {

    if (window.runFunction === 'functionBurst') {
        let passedFunction = window.renderSchema.customFunctions.app
      

        miniDOM(passedFunction, initView);


        function initView(){
            const startButton = document.getElementById('startGameButton');
            startButton.addEventListener('click', startLevel1Game);
          
            function startLevel1Game() {
                window.routeCall('level1');
              }
        }
        
            
 
    } else {
        console.warn("app view: runFunction not set, halting execution.");
    }
}