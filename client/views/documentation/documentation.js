window.frozenVanilla("documentation", function (vanillaPromise) {
  console.log(vanillaPromise.this + " ran");

  let genButtonRoute = "gen";
  $("#genbutton-documentation_documentation").on("click", function (e) {
    let route = this.getAttribute("data-route");
    window.myState([genButtonRoute, `../${genButtonRoute}`]);
  });
});
