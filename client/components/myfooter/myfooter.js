ë.frozenVanilla("myfooter", async function (vanillaPromise) {
  // Your function logic here

  console.log(vanillaPromise.this + "is ready and running");

  let html = "";
  for (let key of Object.keys(vanillaPromise.schema)) {
    html += `<li class="footer-link" data-route="${key}">${key.toUpperCase()}</li>`;
  }

  await ë.updateComponent(
    vanillaPromise,
    {
      clear: true,
      tag: "ul",
      html: [html],
    },
    "footerlinks",
    `#linklist`
  );

  ë.linkBurst(".footer-link");
});
