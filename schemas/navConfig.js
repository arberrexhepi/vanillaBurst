window.frozenVanilla("navConfig", function () {
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
