window.frozenVanilla("heroHeader", function (vanillaPromise) {
  console.log(vanillaPromise.this + " ran");

  let button = document.querySelector("button.headerbutton");
  button.addEventListener("click", function (event) {
    let route = event.target.getAttribute("data-route");
    window.myState([route, `../?burst=${route}`]);
  });
});
