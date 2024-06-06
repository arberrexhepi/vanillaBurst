ë.frozenVanilla("myfooterConfig", function () {
  ///this is as basic as a Shared package function aka Scoop can get!
  let myfooterConfig = {
    myfooter: {
      dir: "client/components/myfooter/",
      functionFile: "myfooter",
      render: "pause",
      htmlPath: "client/components/myfooter/myfooter.html",
      cssPath: "client/components/myfooter/css/style.css",
      container: "myfooter-wrapper",
      classNames: "footer",
      originBurst: {
        namespace: null,
      },
      components: {
        footerlinks: {
          id: "footerlinks",
          container: "mainFooter",
          dir: "myfooter/",
          classNames: "footerlinks",
          cache: true,
          children: `
          <ul id="linklist">
          <!--links will show up here-->
          </ul>`,
        },
      },
    },
  };

  return myfooterConfig;
});
