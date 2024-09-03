ë.frozenVanilla("myweather", async function (vanillaPromise) {
  // Log the status of the function initialization
  ë.logSpacer(`${vanillaPromise.this} is ready and running`, null, null, true);

  const weatherSB =
    vanillaPromise.signalBurst[vanillaPromise.renderSchema.landing].myweather;

  // Log the signalBurst for debugging
  ë.logSpacer("This is the signalBurst: ", weatherSB, null, true);

  // Define the weatherSignal_runner object
  const weatherSignalRunner = {
    weatherRefreshDisplay: async function (data) {
      handleWeatherRefreshDisplay(data, vanillaPromise);
    },
    updateWeatherInfo: async function (data) {
      return await handleUpdateWeatherInfo(data, vanillaPromise);
    },
  };

  // Store the weather signal runner in the signalStore
  ë.signalStore("weatherSignal_runner", weatherSignalRunner);

  // Function to handle weather refresh display
  function handleWeatherRefreshDisplay(data, vanillaPromise) {
    const weatherTimer = document.querySelector(".weather-timer");

    if (weatherTimer) {
      ë.updateComponent(
        vanillaPromise,
        { html: [data.counter] },
        "myweather",
        ".weather-timer"
      );
    }

    if (data.action === "remove" || data.action === "reset") {
      handleActionResetOrRemove(data);
    }
  }

  // Function to handle reset or remove actions
  function handleActionResetOrRemove(data) {
    if (data.action === "reset") {
      document.getElementById("reset-weather-signal").disabled = true;
    }

    if (data.action === "remove") {
      const weatherButtons = document.querySelectorAll(
        "#myweather-homeview_myweather .weatherapp-button"
      );
      weatherButtons.forEach((button) => (button.disabled = true));

      ë.updateComponent(
        vanillaPromise,
        { html: ["You have removed this signal for this session."] },
        "myweather",
        ".timer-info-container"
      );
    }
  }

  // Function to handle updating weather info
  async function handleUpdateWeatherInfo(data, vanillaPromise) {
    ë.logSpacer(`status at callback ${JSON.stringify(data.action)}`);

    if (data.action !== "completed" && data.action !== "init") {
      return { callBackStatus: false };
    }

    const weatherInfo = await fetchWeatherInfo(vanillaPromise);
    runWeatherTopping(weatherInfo);

    return { callBackStatus: data.signalStatus };
  }

  // Function to fetch weather info
  async function fetchWeatherInfo(vanillaPromise) {
    const { dataSchema } = vanillaPromise.passedFunction;
    const randomCity = selectRandomCity(dataSchema.data.cities);
    dataSchema.url = replaceCityInUrl(dataSchema.url, randomCity);

    const weatherInfo = await ë.serverRender(dataSchema);
    return JSON.parse(weatherInfo);
  }

  // Function to select a random city
  function selectRandomCity(cities) {
    return cities[Math.floor(Math.random() * cities.length)];
  }

  // Function to replace the city in the API URL
  function replaceCityInUrl(url, city) {
    return url.replace(/=.*/, `=${city}`);
  }

  // Function to run weather topping updates
  function runWeatherTopping(parsedWeatherInfo) {
    const changing = {
      "#city-name": parsedWeatherInfo.location.name,
      "#country-name": parsedWeatherInfo.location.country,
      "#temperature": `${parsedWeatherInfo.current.temp_c}°C`,
      "#description": parsedWeatherInfo.current.condition.text,
      "#weather-icon": `<img alt="Weather icon" src="https:${parsedWeatherInfo.current.condition.icon}">`,
      "#wind-speed": `Wind speed: ${parsedWeatherInfo.current.wind_kph} kph`,
    };

    for (let [selector, htmlContent] of Object.entries(changing)) {
      ë.updateComponent(
        vanillaPromise,
        { clear: false, html: [htmlContent] },
        "myweather",
        selector
      );
    }
  }
});
