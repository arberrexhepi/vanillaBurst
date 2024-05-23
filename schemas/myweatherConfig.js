window.frozenVanilla("myweatherConfig", function () {
  let myweatherConfig = {
    myweather: {
      dir: "client/components/myweather/",
      functionFile: "myweather",
      render: "pause",
      originBurst: {},
      htmlPath: "client/components/myweather/myweather.html",
      cssPath: "client/components/myweather/myweather.css",
      container: "weather-wrapper",
      //components: {},
      dataSchema: {
        resultTarget: "myweather",
        returnResult: true,
        method: "GET",
        url: "https://weatherapi-com.p.rapidapi.com/current.json?q=Pristina",
        data: {},
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
