ë.frozenVanilla("linkBurst", async function (target) {
  await ë.renderComplete;

  //include a vanillaPromise access check for this plugin by target ie vanillaPromise.vanillaScoopList (check for scoopTag)

  if (target) {
    let scoopTag = "linkBurst";

    ë.vanillaMess(scoopTag, "linkBurst", target, "string");

    let navLinks = document.querySelectorAll(target);
    let navBuilt = [];
    navLinks.forEach((link) => {
      const route = link.getAttribute("data-route");

      if (!route) {
        ë.vanillaMess(
          "Link Check",
          "Missing data-route attribute",
          link,
          "string"
        );
      } else if (ë.vanillaStock === true) {
        navBuilt.push(`Path: ../?burst=${route}`);
      }

      link.addEventListener("click", function () {
        if (this) navLinks.forEach((i) => i.classList.remove("active"));

        this.classList.add("active");

        let route = this.getAttribute("data-route");
        if (!route) {
          ë.vanillaMess(
            "Route Check",
            "Missing data-route attribute on click",
            this,
            "string"
          );
        } else {
          ë.myState([route, `../?burst=${route}`]);
        }
      });
    });
    ë.vanillaMess(scoopTag, "Built links", navBuilt, "array");
  }
});
