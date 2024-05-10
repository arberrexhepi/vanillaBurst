window.frozenVanilla(
  "nav",
  function (vanillaPromise) {
    console.log(vanillaPromise.this + " ran");

    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        let route = this.getAttribute("data-route");
        window.myState([route, `../?burst=${route}`]);
      });
    });
  },
  true
);
