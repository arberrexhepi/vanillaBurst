//only sets 1 route (the one on initial path), and is never called again until a full page reload, or could be requested for ajax rerendering

window.frozenVanilla("getRoute", function (param) {
  const path = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  loadParams = {};

  const burstRoute = searchParams.get("burst");
  const namespace = searchParams.get("name_space");
  const entry = searchParams.get("entry");
  const appRoutes = ["journey", "publisher", "post", "blog"];

  function routeCheck(routeCheckArray) {
    if (burstRoute) {
      return burstRoute;
    } else {
      const pathSegments = path.split("/");
      for (let currentRoute in routeCheckArray) {
        if (path !== "/" && pathSegments[0] === currentRoute) {
          return pathSegments[pathSegments.length - 1];
        } else if (path === "/" && burstRoute) {
          return burstRoute;
        } else if (
          pathSegments !== "" &&
          pathSegments[0] !== currentRoute &&
          pathSegments[0] !== burstRoute
        ) {
          return pathSegments[pathSegments.length - 2];
        } else if (pathSegments === "" && !burstRoute) {
          return currentRoute;
        } else if (path === "/" && !burstRoute) {
          return currentRoute;
        }
      }
    }
  }

  function routeCheckPath(routeCheckArray) {
    const routeCheckResult = routeCheck(routeCheckArray);
    const pathSegments = path.split("/");

    if (pathSegments.includes(routeCheckResult)) {
      const lastSegment = pathSegments.pop();
      if (
        pathSegments[pathSegments.length - 1] !== "" &&
        pathSegments[pathSegments.length - 1] !== undefined
      ) {
        return pathSegments[1] + "/" + routeCheckResult + "/" + lastSegment;
      } else {
        return lastSegment;
      }
    } else {
      return routeCheckResult;
    }
  }

  function buildLink(routeCheckArray) {
    const routeCheckResult = routeCheck(routeCheckArray);
    const pathSegments = path.split("/");

    let name_space = pathSegments.slice(1, -1).join("+");
    const default_name_space = pathSegments.slice(1).join("/");

    if (!name_space) {
      if (!pathSegments[pathSegments.length - 1]) {
        return false;
      } else {
        name_space = routeCheckResult;
        return `?burst=${
          pathSegments[pathSegments.length - 1]
        }&name_space=${name_space}&entry=${
          pathSegments[pathSegments.length - 1]
        }`;
      }
    } else {
      // Set stateTagPath without redirect
      return `?burst=${
        pathSegments[pathSegments.length - 2]
      }&name_space=${name_space}&entry=${
        pathSegments[pathSegments.length - 1]
      }`;
    }
  }

  switch (param) {
    case "route":
      if (routeCheck(appRoutes)) {
        return routeCheck(appRoutes);
      } else {
        return window.appRoute;
      }

      break;

    case "source_path":
      if (routeCheckPath(appRoutes)) {
        return routeCheckPath(appRoutes);
      } else {
        if (routeCheck(appRoutes)) {
          return routeCheck(appRoutes);
        } else {
          return window.appRoute;
        }
      }

      break;
    case "buildlink":
      return buildLink(appRoutes);

      break;
  }
});

//route = getRoute();

route = getRoute("route");
stateTag = route;
let buildLink = getRoute("buildlink");
stateTagPath = getRoute("source_path");

if (stateTagPath !== "" || stateTagPath !== undefined) {
  concatLinkBuild = new URLSearchParams(window.location.search).toString();
  if (new URLSearchParams(window.location.search).toString() !== buildLink) {
    concatLinkBuild = new URLSearchParams(window.location.search).toString();
    if (buildLink) {
      stateTagPath = stateTagPath + buildLink;
    } else {
      const searchParams = new URLSearchParams(window.location.search);
      const burstRoute = searchParams.get("burst") || stateTag;
      const namespace = searchParams.get("name_space") || route;
      const entry = searchParams.get("entry") || "init";

      stateTagPath =
        "?burst=" + burstRoute + "&name_space=" + namespace + "&entry=" + entry;
    }
  } else {
    stateTagPath = concatLinkBuild.split("?")[0];
  }
} else {
  stateTagPath = route;
}
routeCycles = 0;
localStorage.setItem("stateBurst", JSON.stringify([stateTag, stateTagPath]));
//loads main app shell (in this case appRoute) then loads the 1 route from initial path.
//Because this function is called via window.renderView() everytime a view is rendered (1 view being app shell appRoute and the other 'initial path route'),
//so i've set a counter to keep track of how many renders have occured. and since we only ever need 1 cycle it doesn't run the function after

window.frozenVanilla(
  "vanillaBurst",
  async function (route, stateTag, stateTagPath, renderComplete, routeCycles) {
    // Initialize or update the route and routeCycles

    // If route is undefined, set it to appRoute
    if (route === undefined) {
      route = window.appRoute;
    }

    routeCall(route);

    //main app shell appRoute
    function routeCall(route) {
      // request was successful for all URLs

      stateInit = true;
      stateStatus = "done";
      if (!loadParams) {
        loadParams = {};
      }
      window.frozenVanilla("stateRoute", stateTag);
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
          return new Promise((resolveCheck) => {
            const checkInterval = setInterval(() => {
              if (renderComplete === "true") {
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
          routeCycles++;
          resolve();
        });
      });
    }

    routeCall = routeCall;
  }
);
//go back to position
window.frozenVanilla("runClose", function runClose() {
  if (history.state?.stateTagName !== window.appRoute) {
    if (history.state && typeof history.state.stateCount === "number") {
      history.go(-history.state.stateCount + 1);
    } else {
      console.log("no previous page");
    }
  }
});

//stateKey sends to history, vanillaGoRoute calls an option route, no route is called if no vanillaGoRoute, preventing from forward overwrites creating mismath between history and originburst index, successfully tested on a low sample test runs
window.frozenVanilla(
  "vanillaGo",
  async function (stateKey, vanillaGoRoute, originBurst) {
    if (vanillaGoRoute === undefined) {
      vanillaGoRoute = stateKey;
    }

    // Check if the stateKey exists in your tracking object
    if (originBurst[stateKey]) {
      // Calculate the position of the state in your tracking object
      const statePosition = Object.keys(originBurst).indexOf(stateKey);
      // Calculate how many steps to go back in the history stack
      const stepsToGoBack = -(statePosition + 1);
      // Use history.go() to navigate to the state
      history.go(stepsToGoBack);

      // Check if vanillaGoRoute is not equal to stateKey before calling routeCall
      if (vanillaGoRoute !== stateKey) {
        setTimeout(function () {
          // routeCall(vanillaGoRoute);
        }, 20); // Then run a route to call
      }
    } else {
      console.error("State not found in the tracking object");
    }
  }
);
