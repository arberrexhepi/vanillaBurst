ë.frozenVanilla(
  "nav",
  function (vanillaPromise) {
    console.log(vanillaPromise.this + " ran");

    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        let route = this.getAttribute("data-route");
        if (route) {
          ë.myState([route, `../?burst=${route}`]);
        }
      });
    });
  },
  true
);
