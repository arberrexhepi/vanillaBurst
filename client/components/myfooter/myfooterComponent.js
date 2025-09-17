ë.frozenVanilla("myfooterComponent", function (data) {
  let myfooterComponent = {
    [`${data?.id}` || "myfooter"]: {
      namespace: [data?.namespace] || ["homeview", "generate"],
      container: data?.container ? data.container : "viewbox",
      classNames: "myfooter-component button round",
      children: `
            <footer id="mainFooter" class="mainFooter content-container">
                <p>Copyright © arbër inc | powered by vanillaBurst | Apache 2.0 License</p>
                <div class="myfooter-wrapper"></div>
            </footer>
          `,
    },
  };

  return myfooterComponent;
});
