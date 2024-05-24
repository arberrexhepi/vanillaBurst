window.frozenVanilla("heroHeader", function (vanillaPromise) {
  let buttons = document.querySelectorAll("button.headerbutton");
  buttons.forEach((button) => {
    button.addEventListener("click", function (event) {
      let route = event.target.getAttribute("data-route");

      window.myState([route, `../?burst=${route}`]);
    });
  });
  window.vanillaParallax({
    targets: [
      "#myHeroHeader",
      "#myHeroHeaderContainer",
      "#hero-logo",
      ".blockquote-wrapper",
      "#blockquote-container-homeview_heroHeader",
      ".action-container",
    ].reverse(),
    range: 100,
    speed: 4,
    max: 200,
  });
});
