ë.frozenVanilla("myweatherConfig", function (burstTo) {
  //this is featured as a vanillaScoop on the main landing page "homview"
  let myweatherConfig = {
    myweather: {
      role: "config",
      render: "pause",
      // fetchDOM: true,
      // container: "myweather-component",
      originBurst: {
        namespace: [burstTo], //auto assign namespace to where it was included as a package, or include your own
      },
      signal: {
        verbose: false,
        clearable: true,
        name: "weatherSignal",
        namespace: true,
        action: "pause",
        onEvent: ["#start-weather-signal", "click"],
        signalStore: "signalStore.weatherSignal",
        init: "updateWeatherInfo",
        count: 60,
        time: 1000,
        repeat: true,
        intermittent: "weatherRefreshDisplay",
        callBack: "updateWeatherInfo",
        affectors: [
          "start-weather-signal",
          "pause-weather-signal",
          "reset-weather-signal",
          "remove-weather-signal",
        ],
        vanillaDOM: {
          component: "weatherappButtons",
          container: ".inner_button_wrapper",
          clear: true,
        },
        affectors: [
          ["#pause-weather-signal", "click", "pause"],
          ["#start-weather-signal", "click", "go"],
          ["#reset-weather-signal", "click", "reset"],
          ["#remove-weather-signal", "click", "remove", "cache"],
        ],
      },
      components: {
        fetchComponents: {
          myweather: {
            data: [{ id: 1 }],
          },
        },
      }, //this Scoop could have its own components, ie if a Scoop is a dashboard Scoop, you could have lots! A scoop can behave like a component when included in a view but it is a static component, in the sense that ë.updateComponent cannot be used with static html files.
      dataSchema: {
        resultTarget: "myweather",
        returnResult: true,
        method: "GET",
        url: "https://weatherapi-com.p.rapidapi.com/current.json?q=Pristina",
        data: {
          cities: [
            "Pristina",
            "New York",
            "Paris",
            "San Francisco",
            "Munich",
            "Geneva",
            "Tokyo",
            "Halifax",
          ],
        },
        //api setting such as below are not recommended for secure and private API communication,
        //you'd proxy this, ie Wordpress users would set actions in the data property, with a nonce
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key":
            "7d9df56711msh1decfb504cf86b4p1ad509jsn2795a9534f87",
          "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
        },
      },
    },
  };

  return myweatherConfig;
});
