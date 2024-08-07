ë.frozenVanilla("myweatherComponent", function (data) {
  alert("running compononent");
  let myweatherComponent = {
    myweather: {
      namespace: ["homeview", "generate"],
      container: `myweather-component-component`,
      classNames: "button round",
      children: `
           <div class="weather-app" id="weather-app">
      <div id="weather-location" class="weather-location">
          <h2 class="city-name" id="city-name">Geneva</h2>
          <p class="country-name" id="country-name">Switzerland</p>
      </div>
      <div id="weather-current" class="weather-current">
          <div id="weather-icon" class="weather-icon-temp">
              <div id="weather-icon-wrapper" class="weather-icon">
                  <img src="https://cdn.weatherapi.com/weather/64x64/day/116.png" alt="Weather icon">
              </div>
              <h3 class="temperature" id="temperature">18°C</h3>
          </div>
          <div id="weather-info" class="weather-info">
              <p class="description" id="description">Partly cloudy</p>
              <p class="wind-speed" id="wind-speed">Wind speed: 6.1 kph</p>
          </div>
      </div>
      <div class="timer-wrapper">
      <div id="timer-info-container">
                  <p id="p1">This Scoop updates every minute.</p>
                  <p id="p2">It uses data from</p>
                  <p id="p3"><code>dataSchema</code></p>
                </div>
                <div id="weather-timer-container" class="weather-timer-container">
                  <div class="weather-timer" id="weather-timer">0</div>
                </div>
                </div></div>
      <div class="button-wrapper">
      <div class="inner_button_wrapper">
                <button id="start-weather-signal" class="weatherapp-button round" data-route="documentation">Start</button>
                <button id="pause-weather-signal" class="weatherapp-button  round" data-route="documentation">Pause</button>
                <button id="reset-weather-signal" class="weatherapp-button  round" data-route="documentation">Reset</button>
                <button id="remove-weather-signal" class="weatherapp-button  round" data-route="documentation">Remove</button>
                </div>
                <br /></div>
  </div>
            `,
    },
  };

  return myweatherComponent;
});
