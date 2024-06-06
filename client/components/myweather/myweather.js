ë.frozenVanilla("myweather", async function (vanillaPromise) {
  // Your function logic here

  //getting some info to see what's available
  ë.logSpacer(vanillaPromise.this + "is ready and running", null, null, true);

  let weatherSB =
    vanillaPromise.signalBurst[vanillaPromise.renderSchema.landing].myweather;

  ///will show the signals available in signalStore to attach functions and affectors to
  ë.logSpacer("This is the signalBurst: ", weatherSB, null, true);
  /////////////

  ë.signalStore("weatherSignal_runner", {
    weatherRefreshDisplay: async function (data) {
      let weatherTimer = document.querySelector(".weather-timer");
      if (weatherTimer) {
        weatherTimer.innerHTML = data.counter;
      }

      if (data.action === "remove" || data.action === "reset") {
        if (data.action === "reset") {
          document.getElementById("reset-weather-signal").disabled = true;
        }

        if (data.action === "remove") {
          let weatherButtons = document.querySelectorAll(
            `#weatherappButtons-${vanillaPromise.renderSchema.landing}_myweather .weatherapp-button`
          );
          weatherButtons.forEach((button) => (button.disabled = true));

          ë.updateComponent(
            vanillaPromise,
            {
              clear: true,
              position: 0,
              tag: "div",
              html: ["You have removed this signal for this session."],
            },
            "timerInfo",
            "#timer-info-container"
          );
        }
      }
    },
    updateWeatherInfo: async function (data) {
      ë.logSpacer("status at callback " + JSON.stringify(data.action));

      if (data.action === "remove") {
        document.getElementById("start-weather-signal").ariaDisabled;
        return { callBackStatus: false };
      }

      if (data.action !== "completed" && data.action !== "init") {
        return { callBackStatus: false };
      }

      const url = vanillaPromise.passedFunction.dataSchema.url;
      const cities = vanillaPromise.passedFunction.dataSchema.data.cities;
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      vanillaPromise.passedFunction.dataSchema.url = url.replace(
        /=.*/,
        `=${randomCity}`
      );

      ë.serverRender(vanillaPromise.passedFunction.dataSchema).then(
        (weatherInfo) => {
          runWeatherTopping(JSON.parse(weatherInfo));
        }
      );

      return { callBackStatus: data.signalStatus };
    },
  });

  function runWeatherTopping(parsedWeatherInfo) {
    // Check if all necessary DOM elements exist
    if (
      document.getElementById("city-name") &&
      document.getElementById("country-name") &&
      document.getElementById("temperature") &&
      document.getElementById("description") &&
      document.getElementById("weather-icon") &&
      document.getElementById("wind-speed")
    ) {
      // Update the DOM elements
      document.getElementById("city-name").innerHTML =
        parsedWeatherInfo.location.name;
      document.getElementById("country-name").innerHTML =
        parsedWeatherInfo.location.country;
      document.getElementById("temperature").innerHTML =
        parsedWeatherInfo.current.temp_c + "°C";
      document.getElementById("description").innerHTML =
        parsedWeatherInfo.current.condition.text;
      document.getElementById("weather-icon").src =
        "https:" + parsedWeatherInfo.current.condition.icon;
      document.getElementById("wind-speed").innerHTML =
        "Wind speed: " + parsedWeatherInfo.current.wind_kph + " kph";
    } else {
      // If not all DOM elements exist, delay the execution of the function and try again
      setTimeout(() => runWeatherTopping(parsedWeatherInfo), 1000);
    }
  }

  ///a function the callBack uses, if myweather was a component within a config ë.updateComponent could be used to update and cache to componentBurst (see footer.js), but what vanillaBurst doesn't do, vanilla JS does, hence vanillaBurst!
});
