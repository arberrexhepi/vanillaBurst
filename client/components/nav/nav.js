 function nav() {

        window.navView = function navView(){
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function () {
                    const route = this.getAttribute('data-route');
                    window.routeCall(route);
                    
                    
                });
            });
        }
    
};