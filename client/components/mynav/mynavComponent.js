ë.frozenVanilla("mynavComponent", async function (data) {
  let navComponent = {
    [`${data.id}`]: {
      namespace: [data.namespace] || ["homeview", "generate"],
      container: data.container ? data.container : "navigation-component",
      classNames: "navigation-component button round",
      children: `
            <nav id="mainNav-container">
            <ul>
                <li>
                    <span class="nav-link" data-route="homeview">
                        <div class="nav-image nav-link" data-img-src="icecream-symbol.png" data-alt="vanillaBurst symbol logo"
                            data-route="homeview"></div>
                    </span>
                </li>
                <li><span class="nav-link" data-route="homeview">Home</span></li>
                <li><span class="nav-link" data-route="documentation">Docs</span></li>
                <li><span class="nav-link" data-route="generate">Generate</span></li>
                <li> <a href="https://github.com/arberrexhepi/vanillaBurstGame">
                        <div class="nav-image nav-link" data-img-src="github-mark.png" data-alt="github mark"
                            data-route="homeview">
                        </div>
                    </a></li>
            </ul>

        </nav>
          `,
    },
  };

  return navComponent;
});
