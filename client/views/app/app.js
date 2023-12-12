window.app = async function app() {

    if (window.runFunction === 'functionBurst') {

        window.domFunction='app'

        window.miniDOM(window.appConfig(), 'app', initView);

        function initView() {
            const startButton = document.getElementById('startGameButton');
            startButton.addEventListener('click', startLevel1Game);

            async function startLevel1Game() {

                await window.routeCall('level1');

            }

        }


    } else {
        console.warn("app view: runFunction not set, halting execution.");
    }
}