window.home = async function home() {

    if (window.runFunction === 'functionBurst') {
        window.domFunction='home'


            window.miniDOM(window.homeConfig(), 'home', 'home', homeView);


        function homeView() {
            window.componentDOM('client/components/buttons/docbutton.html', 'client/components/buttons/buttons.css', 'button-wrapper', 'docbutton')


        }



    } else {
        console.warn("home view: runFunction not set, halting execution.");
    }
}