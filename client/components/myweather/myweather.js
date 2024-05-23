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

  async function scheduleWeatherUpdate(weathcerInfo) {
    while (true) {
      weathcerInfo = await window.serverRender(
        vanillaPromise.passedFunction.dataSchema
      );
      const parsedWeatherInfo = JSON.parse(weathcerInfo);
      runWeatherTopping(parsedWeatherInfo);
      await new Promise((resolve) => setTimeout(resolve, 60000));
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
