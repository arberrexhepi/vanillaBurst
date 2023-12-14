window.app = async function app() {

    if (window.runFunction === 'functionBurst') {

        window.domFunction='app'

        window.miniDOM(window.appConfig(), 'app', appView);

        window.componentDOM('client/components/nav/nav.html', 'client/components/nav/nav.css', 'navbar', 'nav')
        window.componentDOM('client/components/buttons/docbutton.html', 'client/components/buttons/buttons.css', 'button-wrapper', 'footer')
        window.componentDOM('client/components/footer/footer.html', 'client/components/footer/footer.css', 'footer', 'footer')

        function appView() {
         

        }


    } else {
        console.warn("app view: runFunction not set, halting execution.");
    }
}