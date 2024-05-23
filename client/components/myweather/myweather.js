window.frozenVanilla("myweather", async function (vanillaPromise) {
  // Your function logic here

  console.log(vanillaPromise.this + "is ready and running");

  let weatherInfo;

  // setInterval(async () => {
  //   parsedWeatherInfo = await window.serverRender(
  //     vanillaPromise.passedFunction.dataSchema
  //   );

  //   parsedWeatherInfo = JSON.parse(parsedWeatherInfo);
  // }, 60000);

  let counter = 0;
  let city;

  async function scheduleWeatherUpdate(weathcerInfo) {
    while (true) {
      weathcerInfo = await window.serverRender(
        vanillaPromise.passedFunction.dataSchema
      );
      const parsedWeatherInfo = JSON.parse(weathcerInfo);
      runWeatherTopping(parsedWeatherInfo);
      counter = 0; // Reset the counter
      await new Promise((resolve) => {
        const intervalId = setInterval(() => {
          counter++;
          document.querySelector(".weather-timer").innerHTML = counter;
          if (counter >= 60) {
            clearInterval(intervalId);

            // Get a random city from the cities array
            const cities = vanillaPromise.passedFunction.dataSchema.data.cities;
            const randomCity =
              cities[Math.floor(Math.random() * cities.length)];

            // Split the URL at '=' and replace the second part with the random city
            let urlParts =
              vanillaPromise.passedFunction.dataSchema.url.split("=");
            urlParts[1] = randomCity;
            vanillaPromise.passedFunction.dataSchema.url = urlParts.join("=");

            resolve();
          }
        }, 1000);
      });
    }
  }

  scheduleWeatherUpdate(weatherInfo);

  function runWeatherTopping(parsedWeatherInfo) {
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
  }
});
