window.appShell = async function appShell() {

    if (window.runFunction === 'functionBurst') {
        
        window.miniDOM(window.appShellConfig(), 'appShell', renderSchema.landing, appView);

        

        async function appView() {
            await window.componentDOM('client/components/nav/nav.html', 'client/components/nav/nav.css', 'navbar', 'nav')
            await window.componentDOM('client/components/footer/footer.html', 'client/components/footer/footer.css', 'footer', 'footer')
            document.body.style.opacity = '1'
            window.appShellReady = true;
            window[renderSchema.landing](appShellReady)

        }


    } else {
        console.warn("app view: runFunction not set, halting execution.");
    }
}