ë.frozenVanilla("myfooter", async function (vanillaPromise) {
  // Your function logic here
  ë.logSpacer(vanillaPromise.this + "is ready and running");

  // const isVerified = await verifyKeyPair(vanillaPromise.publicKey, "myfooter");

  // if (isVerified) {
  //   alert("verified");
  // } else {
  //   alert("go away");
  //   window.location("http://google.com");
  // }

  let html = "";
  for (let key of ë.frozenVanilla.get("registeredRoutes")) {
    html += `<li class="footer-link" data-route="${key}">${key.toUpperCase()}</li>`;
  }

  await ë.updateComponent(
    vanillaPromise,
    {
      clear: true,
      tag: "ul",
      classNames: "dynamic-links",
      html: [html],
    },
    "footerlinks",
    `#linklist`
  );

  ë.linkBurst(".footer-link");
});
