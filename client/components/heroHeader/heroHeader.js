ë.frozenVanilla("heroHeader", function (vanillaPromise) {
  ë.linkBurst("button.headerbutton");

  /////vendorScoop vanillaAnimation js is in: scoops/vanillaAnimation, for now styles are not programmatic, so just root folder and inlineHTML style tag declaration, DEFINITELY a WIP but it was a great way to implement vanillaScoops installation logic and ë.vanillaMess type checker and logger

  ë.vanillaAnimation({
    0: {
      vanillaPromise,
      play: "play", //or scroll
      duration: 1,
      units: ["vw", "vh", "vh"],
      positionStart: [0, -200, 0],
      positionFinish: [0, 200, 0],
      // scaleStart: [0.8, 0.8, 0.8], //for zoom, but it's not working for multiple effects atm
      // scaleFinish: [2, 2, 2], // //for zoom, but it's not working for multiple effects atm
      target: ".icecream",
      repeatCount: 999,
      offset: 1,
      speed: 10,
      zIndex: -1,
      loop: ["normal", "reverse"],
      motion: "linear",
      randomize: false,
      effects: ["pan"],
      spawn: null,
      namespace: true,
    },
    1: {
      vanillaPromise,
      namespace: true,
      play: "play",
      duration: 1,
      units: ["vh", "vh", "vh"],
      positionStart: [-15, -285, 0],
      positionFinish: [-15, 285, 0],
      target: ".ë",
      repeatCount: 999,
      offset: 1,
      speed: 10,
      zIndex: -1,
      loop: ["reverse", "reverse"],
      motion: "linear",
      randomize: false,
      effects: ["pan"],
      spawn: ["up", 1], //1 spawn makes a consitent loop without distance/time gaps
    },
  });
});
