ë.frozenVanilla("navConfig", function (burstTo) {
  ///this is as basic as a Shared package function aka Scoop can get!
  let navConfig = {
    nav: {
      role: "component",
      render: "pause",
      fetchDOM: true,
      container: "mainNav",
      originBurst: {
        namespace: [burstTo, "homeview", "generate", "documentation"],
      },
      components: {},
    },
  };

  return navConfig;
});
