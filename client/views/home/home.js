function home() {

   
           window.homeView = async function homeView(){

            
            let button = document.getElementById('docbutton');
            button.addEventListener('click', function () {
                window.routeCall('documentation');
            });
        }

}