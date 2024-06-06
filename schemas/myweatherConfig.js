ë.frozenVanilla("myweatherConfig", function (burstTo) {
  //this is featured as a vanillaScoop on the main landing page "homview"
  let myweatherConfig = {
    myweather: {
      dir: "client/components/myweather/",
      functionFile: "myweather",
      render: "pause",
      originBurst: {
        namespace: [burstTo], //auto assign namespace to where it was included as a package, or include your own
      },
      htmlPath: "client/components/myweather/myweather.html",
      cssPath: "client/components/myweather/css/style.css",
      container: "weather-wrapper",
      classNames: "weather-wrapper scoop card",
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
        timerInfo: {
          namespace: ["homeview"],
          cache: true,
          dir: "myweather/",
          id: "timerInfo",
          container: "timer-wrapper",
          classNames: "timer-info",
          children: `
            <div id="timer-info-container">
              <p id="p1">This Scoop updates every minute.</p>
              <p id="p2">It uses data from</p>
              <p id="p3"><code>dataSchema</code></p>
            </div>
            <div id="weather-timer-container" class="weather-timer-container">
              <div class="weather-timer" id="weather-timer">0</div>
            </div>
            </div>
          `,
        },
        weatherappButtons: {
          namespace: ["homeview"],
          cache: true,
          dir: "buttons/",
          id: "weatherappButtons",
          container: "button-wrapper",
          classNames: "weatherapp-buttons",
          children: `
            <div class="inner_button_wrapper">
            <button id="start-weather-signal" class="weatherapp-button round" data-route="documentation">Start</button>
            <button id="pause-weather-signal" class="weatherapp-button  round" data-route="documentation">Pause</button>
            <button id="reset-weather-signal" class="weatherapp-button  round" data-route="documentation">Reset</button>
            <button id="remove-weather-signal" class="weatherapp-button  round" data-route="documentation">Remove</button>
            </div>
            <br />
            `,
          eventHandlers: "submit:preventDefault",
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
