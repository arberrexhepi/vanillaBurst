ë.frozenVanilla("myweather", async function (vanillaPromise) {
  // ë.logSpacer(`${vanillaPromise.this} is ready and running`, null, null, true);

  //CONTROLLING THE SIGNALS DYNAMICALLY
  //  const weatherSB =vanillaPromise.signalBurst[vanillaPromise.renderSchema.landing].myweather;

  // weatherSB.time = 1000;

  // Store the weather signal runner in the signalStore
  ë.signalStore("weatherSignal_runner", {
    weatherRefreshDisplay: async function (data) {
      let returnData = await handleWeatherRefreshDisplay(data, vanillaPromise);
      return returnData;
    },
    updateWeatherInfo: async function (data) {
      return await handleUpdateWeatherInfo(data, vanillaPromise);
    },
  });

  // Function to handle weather refresh display
  async function handleWeatherRefreshDisplay(data, vanillaPromise) {
    const weatherTimer = document.querySelector(".weather-timer");

    if (data.action === "go" || data.action === "reset") {
      if (weatherTimer) {
        ë.updateComponent(
          vanillaPromise,
          { html: [data.counter] },
          "myweather1",
          ".weather-timer"
        );
      }
    }

    if (data.action === "remove") {
      handleActionResetOrRemove(data, "Removing Signal");
    }
    //OPTIONAL: additionally do something on removed confirmed signal state
    if (data.action === "removed") {
      handleActionResetOrRemove(
        data,
        "You have removed this signal for this session."
      );
    }

    return data;
  }

  // Function to handle reset or remove actions
  function handleActionResetOrRemove(data, uiMessage) {
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
        { html: [uiMessage] },
        "myweather1",
        ".timer-info-container"
      );
      ë.updateComponent(
        vanillaPromise,
        { html: ["0"] },
        "myweather1",
        ".weather-timer"
      );
    }
  }

  // Function to handle updating weather info
  async function handleUpdateWeatherInfo(data, vanillaPromise) {
    ë.logSpacer(`status at callback ${JSON.stringify(data.action)}`);

    if (data.action !== "completed" && data.action !== "init") {
      return { callBackStatus: true };
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
    return weatherInfo.myweatherResult.value;
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
        "myweather1",
        selector
      );
    }
  }
});
