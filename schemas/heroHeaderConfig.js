window.frozenVanilla("heroHeaderConfig", function () {
  let heroHeaderConfig = {
    heroHeader: {
      dir: "client/views/homeview/",
      functionFile: "heroHeader",
      render: "pause",
      htmlPath: "client/views/homeview/heroHeader.html",
      cssPath: "client/views/homeview/heroHeader.css",
      container: "myHeroHeader",
      originBurst: {
        namespace: null,
      },
    },
  };

  return heroHeaderConfig;
});
