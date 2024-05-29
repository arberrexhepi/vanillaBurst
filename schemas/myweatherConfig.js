ë.frozenVanilla("myweatherConfig", function () {
  //this is featured as a vanillaScoop on the main landing page "homview"
  let myweatherConfig = {
    myweather: {
      dir: "client/components/myweather/",
      functionFile: "myweather",
      render: "pause",
      originBurst: {},
      htmlPath: "client/components/myweather/myweather.html",
      cssPath: "client/components/myweather/myweather.css",
      container: "weather-wrapper",
      classNames: "weather-wrapper scoop card",
      //components: {}, //this Scoop could have its own components, ie if a Scoop is a dashboard Scoop, you could have lots!
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
