ë.frozenVanilla("myfooterComponent", function (data) {
  let myfooterComponent = {
    [`${data?.id}` || "myfooter-container"]: {
      namespace: [data?.namespace] || ["homeview", "generate"],
      container: data?.container ? data.container : "viewbox",
      classNames: "myfooter-container button round",
      children: `
            <footer id="mainFooter" class="mainFooter content-container">
                <p>Copyright © arbër inc | powered by vanillaBurst | Apache 2.0 License</p>
                <div class="myfooter-wrapper">
                <ul id="linklist">
            <!--links will show up here-->
            </ul>
            </div>
            </footer>
          `,
    },
  };

  return myfooterComponent;
});
