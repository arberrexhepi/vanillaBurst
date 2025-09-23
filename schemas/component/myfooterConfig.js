ë.frozenVanilla("myfooterConfig", function (burstTo) {
  ///this is as basic as a Shared package function aka Scoop can get!
  let myfooterConfig = {
    myfooter: {
      role: "component",
      render: "pause",
      fetchDOM: true,
      container: "myfooter-component",
      classNames: "footer",
      originBurst: {
        namespace: ["homeview"],
      },
      components: {},
    },
  };

  return myfooterConfig;
});
