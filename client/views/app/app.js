window.app = async function app() {

    if (window.runFunction === 'functionBurst') {


            const startButton = document.getElementById('startGameButton');
            startButton.addEventListener('click', startLevel1Game);
          
            function startLevel1Game() {
                window.routeCall('level1');
              }
            
 
    } else {
        console.warn("app view: runFunction not set, halting execution.");
    }
}