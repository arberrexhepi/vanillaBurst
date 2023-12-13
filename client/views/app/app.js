window.app = async function app() {

    if (window.runFunction === 'functionBurst') {

        window.domFunction='app'

        window.miniDOM(window.appConfig(), 'app', initView);

        window.componentDOM('client/components/nav/nav.html', 'client/components/nav/nav.css', 'navbar', 'nav')

        window.componentDOM('client/components/footer/footer.html', 'client/components/nav/footer.css', 'footer', 'footer')

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