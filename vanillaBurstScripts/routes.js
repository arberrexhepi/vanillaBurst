//only sets 1 route (the one on initial path), and is never called again until a full page reload
document.addEventListener('load', function(){
    //('hi')
})
//only sets 1 route (the one on initial path), and is never called again until a full page reload
function getRoute() {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const burstRoute = searchParams.get('burst');

    if (path === "/" && !burstRoute) {
        return appRoute;
    } else if (burstRoute) {
        return burstRoute;
    }
    return null; // or some default route
}

window.route = getRoute();
window.routeCycles = 0;

//loads main app shell (in this case appRoute) then loads the 1 route from initial path. 
//Because this function is called via window.renderView() everytime a view is rendered (1 view being app shell appRoute and the other 'initial path route'), 
//so i've set a counter to keep track of how many renders have occured. and since we only ever need 1 cycle it doesn't run the function after

window.vanillaBurst = async function vanillaBurst(renderComplete, route, routeCycles) {
    // Initialize or update the route and routeCycles
    routeCycles = window.routeCycles || routeCycles;
    route = window.route || route;

    // If route is undefined, set it to appRoute
    if (route === undefined) {
        route = window.appRoute;
    }

    if (route === '/' && window.location.search.includes('burst')) {
        // Extract burst value from URL
        const searchParams = new URLSearchParams(window.location.search);
        const burstRoute = searchParams.get('burst');
        // Call routeCall with burstRoute if it exists
        if (burstRoute) {
            routeCall(burstRoute);
        } else {
            // If burst value is not present, call appRoute
            routeCall(window.appRoute);
        }
    } else {
        // Call routeCall for the current route
        routeCall(route);
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


  //stateKey sends to history, vanillaGoRoute calls an option route, no route is called if no vanillaGoRoute, preventing from forward overwrites creating mismath between history and originburst index
  window.vanillaGo = async function vanillaGo(stateKey, vanillaGoRoute) {
    if (vanillaGoRoute === undefined) {
        vanillaGoRoute = stateKey;
    }
  
    // Check if the stateKey exists in your tracking object
    if (window.originBurst[stateKey]) {
      // Calculate the position of the state in your tracking object
      const statePosition = Object.keys(window.originBurst).indexOf(stateKey);
      // Calculate how many steps to go back in the history stack
      const stepsToGoBack = -(statePosition + 1);
      // Use history.go() to navigate to the state
      history.go(stepsToGoBack);
  
      // Check if vanillaGoRoute is not equal to stateKey before calling window.routeCall
      if (vanillaGoRoute !== stateKey) {
        setTimeout(function () {
         // window.routeCall(vanillaGoRoute);
        }, 20); // Then run a route to call
      }
    } else {
      console.error("State not found in the tracking object");
    }
  };
  
  