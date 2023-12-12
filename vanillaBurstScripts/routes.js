//only sets 1 route (the one on initial path), and is never called again until a full page reload
document.addEventListener('load', function(){
    //alert('hi')
})
function getRoute() {
    const path = window.location.pathname;

    if (path === "/"+appRoute) {
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
    routeCycles = window.routeCycles || routeCycles;
     route = window.route || route;
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

window.routeCall = routeCall;


}

//go back to position
window.runClose = function runClose() {
    if (history.state?.stateTagName !== window.appRoute) {
      if (history.state && typeof history.state.stateCount === 'number') {
        history.go(-(history.state.stateCount) + 1);


      } else {
        console.log("no previous page")
      }
    }


  }


  window.navigateToStateByProperty = function navigateToStateByProperty(propertyName, propertyValue) {
    const historyStack = window.originBurst;
    
    for (let i = 0; i < historyStack.length; i++) {
      const state = historyStack[i].app;
      alert(state)
    //   if (state.hasOwnProperty(propertyName) && state[propertyName] === propertyValue) {
    //     // Found the desired state, navigate to it
    //     window.history.go(i - historyStack.length + 1);
    //     return;
    //   }
     }
    
    // State with the specified property value not found
    //console.error("State not found");
  }


  window.vanillaGo = function vanillaGo(stateKey) {
    // Check if the stateKey exists in your tracking object
    if (window.originBurst[stateKey]) {
      // Calculate the position of the state in your tracking object
      const statePosition = Object.keys(window.originBurst).indexOf(stateKey);
      // Calculate how many steps to go back in the history stack
      const stepsToGoBack = -(statePosition + 1);
      // Use history.go() to navigate to the state
      history.go(stepsToGoBack);
    } else {
      console.error("State not found in the tracking object");
    }
  }
  