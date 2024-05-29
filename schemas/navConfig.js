ë.frozenVanilla("navConfig", function () {
  ///this is as basic as a Shared package function aka Scoop can get!
  let navConfig = {
    nav: {
      dir: "client/components/nav/",
      functionFile: "nav",
      render: "pause",
      htmlPath: "client/components/nav/nav.html",
      cssPath: "client/components/nav/nav.css",
      container: "mainNav",
      originBurst: {
        namespace: null,
      },
    },
  };

  return navConfig;
});
