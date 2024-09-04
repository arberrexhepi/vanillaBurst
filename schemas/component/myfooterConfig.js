ë.frozenVanilla("myfooterConfig", function () {
  ///this is as basic as a Shared package function aka Scoop can get!
  let myfooterConfig = {
    myfooter: {
      role: "config",
      render: "pause",
      fetchDOM: true,
      // functionFile: "myfooter",
      // cssPath: "client/components/myfooter/myfooter.css",
      // htmlPath: "client/components/myfooter/myfooter.html",
      container: "mainFooter",
      classNames: "footer",
      originBurst: {
        namespace: ["homeview"],
      },
      components: {
        footerlinks: {
          id: "footerlinks",
          count: "1",
          componentName: "myfooter",
          container: "myfooter-wrapper",
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
