window.frozenVanilla("heroHeader", function (vanillaPromise) {
  console.log(vanillaPromise.this + " ran");

  let buttons = document.querySelectorAll("button.headerbutton");
  buttons.forEach((button) => {
    button.addEventListener("click", function (event) {
      let route = event.target.getAttribute("data-route");
      window.myState([route, `../?burst=${route}`]);
    });
  });
});
