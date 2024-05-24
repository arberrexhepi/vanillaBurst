window.frozenVanilla("myweather", async function (vanillaPromise) {
  // Your function logic here

  console.log(vanillaPromise.this + "is ready and running");

  let weatherInfo;
  let counter = 0;
  let city;

  updateWeatherInfo(counter, city);

  function updateWeatherInfo(counter, city) {
    alert("Yo");
    // Get a random city from the cities array
    const cities = vanillaPromise.passedFunction.dataSchema.data.cities;
    let randomCity = cities[Math.floor(Math.random() * cities.length)];

    // Split the URL at '=' and replace the second part with the random city
    let urlParts = vanillaPromise.passedFunction.dataSchema.url.split("=");
    urlParts[1] = randomCity;
    vanillaPromise.passedFunction.dataSchema.url = urlParts.join("=");

    // Fetch the weather data and update the DOM
    window
      .serverRender(vanillaPromise.passedFunction.dataSchema)
      .then((weatherInfo) => {
        const parsedWeatherInfo = JSON.parse(weatherInfo);
        runWeatherTopping(parsedWeatherInfo);
      });
  }

  // Register the interval with the callback function
  window.registerInterval(
    "serverRepeatableWeatherCall",
    20,
    60000,
    (repeat = true),
    updateWeatherInfo,
    "clear",
    null
  );

  function startInterval(counter) {
    document.querySelector(".weather-timer").innerHTML = counter;
  }

  window.registerInterval(
    "repeatable-timer",
    60,
    1000,
    (repeat = true),
    startInterval,
    "clear",
    null
  );

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
});
