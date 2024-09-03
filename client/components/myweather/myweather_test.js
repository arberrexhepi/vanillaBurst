ë.frozenVanilla("myweather", async function (vanillaPromise) {
  vanillaResource("myweather", {
    signals: {
      weatherSignal_runner: {
        weatherRefreshDisplay: async function (data) {
          this.domUpdates.handleWeatherRefreshDisplay(data);
        },
        updateWeatherInfo: async function (data) {
          return await this.functions.handleUpdateWeatherInfo(data);
        },
      },
    },

    domUpdates: {
      handleWeatherRefreshDisplay: function (data) {
        const weatherTimer = document.querySelector(".weather-timer");

        if (weatherTimer) {
          ë.updateComponent(
            null,
            { html: [data.counter] },
            "myweather",
            ".weather-timer"
          );
        }

        if (data.action === "remove" || data.action === "reset") {
          this.domUpdates.handleActionResetOrRemove(data);
        }
      },

      handleActionResetOrRemove: function (data) {
        if (data.action === "reset") {
          document.getElementById("reset-weather-signal").disabled = true;
        }

        if (data.action === "remove") {
          const weatherButtons = document.querySelectorAll(
            "#myweather-homeview_myweather .weatherapp-button"
          );
          weatherButtons.forEach((button) => (button.disabled = true));

          ë.updateComponent(
            null,
            { html: ["You have removed this signal for this session."] },
            "myweather",
            ".timer-info-container"
          );
        }
      },

      runWeatherTopping: function (parsedWeatherInfo) {
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
            null,
            { clear: false, html: [htmlContent] },
            "myweather",
            selector
          );
        }
      },
    },

    functions: {
      handleUpdateWeatherInfo: async function (data) {
        ë.logSpacer(`status at callback ${JSON.stringify(data.action)}`);

        if (data.action !== "completed" && data.action !== "init") {
          return { callBackStatus: false };
        }

        const weatherInfo = await this.functions.fetchWeatherInfo();
        this.domUpdates.runWeatherTopping(weatherInfo);

        return { callBackStatus: data.signalStatus };
      },

      fetchWeatherInfo: async function () {
        const { dataSchema } = vanillaPromise.passedFunction;
        const randomCity = this.functions.selectRandomCity(
          dataSchema.data.cities
        );
        dataSchema.url = this.functions.replaceCityInUrl(
          dataSchema.url,
          randomCity
        );

        const weatherInfo = await ë.serverRender(dataSchema);
        return JSON.parse(weatherInfo);
      },

      selectRandomCity: function (cities) {
        return cities[Math.floor(Math.random() * cities.length)];
      },

      replaceCityInUrl: function (url, city) {
        return url.replace(/=.*/, `=${city}`);
      },
    },
  });

  function vanillaResource(name, resourceConfig) {
    function bindMethods(obj, context) {
      for (const key in obj) {
        if (typeof obj[key] === "function") {
          obj[key] = obj[key].bind(context);
        }
      }
    }

    // Bind methods
    bindMethods(resourceConfig.signals.weatherSignal_runner, resourceConfig);
    bindMethods(resourceConfig.domUpdates, resourceConfig);
    bindMethods(resourceConfig.functions, resourceConfig);

    // Store the resourceConfig in ë with the name provided
    ë[name] = resourceConfig;

    // Register signals in the signal store
    for (const [signalName, signalHandlers] of Object.entries(
      resourceConfig.signals
    )) {
      // Check if the signalName is already registered in ë.signalStore
      if (!ë.signalStore.get(signalName)) {
        ë.signalStore(signalName, {});
      }

      // Register each signal handler under its respective signalName
      for (const [handlerName, handler] of Object.entries(signalHandlers)) {
        ë.signalStore.get(signalName)[handlerName] = handler;
      }
    }
  }
});
