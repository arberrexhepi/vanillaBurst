ë.frozenVanilla("actionButtonComponent", async function (data) {
  let actionButtonComponent = {
    [`${data.id}`]: {
      namespace: [data.namespace] || ["homeview", "generate"],
      container: data.container ? data.container : "actionButton-component",
      classNames: "actionButton-component button round",
      children: `
          <div class="button_wrapper">
            <button class="headerbutton ${data.classNames}"
             data-route="${data.route || ë.defaultAppRoute}">
             ${data.text || "View Documentation"}
            </button>
          </div>
          <br />
        `,
    },
  };

  return actionButtonComponent;
});
