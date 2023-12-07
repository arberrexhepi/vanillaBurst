//only sets 1 route (the one on initial path), and is never called again until a full page reload
function getRoute() {
    const path = window.location.pathname;

    if (path === "/"+appRoute || path === "/" || path === "") {
        return appRoute;
    } else {
        if(path !== undefined){
            const routeFilter = path.split('/');
            return routeFilter[1]; // Assuming the route is the second part of the URL
        }else{
            return appRoute; //fallback to default
        }
   
    
    }
}
window.route = getRoute();
window.routeCycles = 0;

//loads main app shell (in this case appRoute) then loads the 1 route from initial path. 
//Because this function is called via window.renderView() everytime a view is rendered (1 view being app shell appRoute and the other 'initial path route'), 
//so i've set a counter to keep track of how many renders have occured. and since we only ever need 1 cycle it doesn't run the function after

window.vanillaBurst = async function vanillaBurst(renderComplete, route, routeCycles){
    routeCycles = window.routeCycles;
     route = window.route;
     if(route === undefined){
        route = window.appRoute;
     }

if(window.renderComplete === "false" && window.route !== appRoute){
    if(routeCycles > 1){
        return
    }else{
        handleRoute( route );
    
    
    if(!window.appReady){
        routeCall(appRoute);
    }
};
}else{
    if(route === appRoute){
        routeCall(appRoute);

    }

}

//main app shell appRoute
function routeCall(route) {
    // request was successful for all URLs
 
        stateTag = route;
        if (stateTag.length > 0 && !stateTag.includes('?fbclid')) {
            stateTagPath = "../" + stateTag;
        } else {
            stateTag = route;
            stateTagPath = "../" + route;
        }
        stateInit = true;
        stateStatus = "done";
        loadParams = {};
        window.stateDefine(stateTag, stateTagPath, loadParams);
    
    
}


//requested view via window.location

async function handleRoute(route) {
    
    // If the initial route is appRoute, we assume routeCall(appRoute) is already called
        await processRoute(route);
    
}

function processRoute(route) {
    return new Promise((resolve, reject) => {
        console.log("Preparing to process route:", route);

        function waitForrenderComplete() {
            return new Promise(resolveCheck => {
                const checkInterval = setInterval(() => {
                    if (window.renderComplete === "true") {
                        clearInterval(checkInterval);
                        resolveCheck();
                    }
                }, 100);
            });
        }

        // Wait for app to be ready, then process the route
        waitForrenderComplete().then(() => {
                routeCall(route);
                window.appReady = true;
                window.routeCycles++;
            resolve();
        });
    });
}




}

