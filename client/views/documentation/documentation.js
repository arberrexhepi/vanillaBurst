window.frozenVanilla("documentation", function (vanillaPromise) {
  console.log(vanillaPromise.this + " ran");

  $("#generateConfigButton").on("click", function (e) {
    let route = this.getAttribute("data-route");
    window.myState([route, `../${route}`]);
  });
});
