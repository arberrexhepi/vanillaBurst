ë.frozenVanilla("linkBurst", async function (target) {
  await ë.renderComplete;

  if (target) {
    ë.vanillaMess("target links", target, "string");

    let navLinks = document.querySelectorAll(target);
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        navLinks.forEach((i) => i.classList.remove("active"));

        this.classList.add("active");

        let route = this.getAttribute("data-route");
        if (route) {
          ë.myState([route, `../?burst=${route}`]);
        }
      });
    });
  }
});
