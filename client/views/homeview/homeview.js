ë.frozenVanilla("homeview", function (vanillaPromise) {
  console.log(vanillaPromise.this + " ran");

  //this scoop was made by chatGPT
  // ë.vanillaMess("check scoop exist", ë.gptScoop, "check");
  // return;

  ë.gptScoop({
    apiUrl: "https://jsonplaceholder.typicode.com/todos/1",
    targetSelector: "#chatGPT-wrapper",
    className: "scoop card",
    css: `
        #chatGPT-wrapper h2 {
            color: #007BFF;
            margin-bottom: 10px;
            font-size: calc(var(--base-font-size) * var(--h1-scale));
            color: #f75f88;
            text-align: center;
            transition: color 0.3s ease-in-out;
        }
        #chatGPT-wrapper p {
            color: #555;
            margin: 5px 0;
        }
        #chatGPT-wrapper span {
          font-size: calc(var(--base-font-size) * var(--p-large-scale));
          margin-top: 2vh;
        }
        #chatGPT-wrapper #status {
          color: cornflowerblue;
        }
        #chatGPT-wrapper #description {
          color: teal;
        }
        #chatGPT-wrapper #tododata {
          text-align:left;
          padding:2.5vh;
          background-color:white;
          border-radius:2vh;
        }
        #chatGPT-wrapper ul {
          list-style-type: none;
          padding: 0;
        }
        #chatGPT-wrapper ul li {
          background-color: #f9f9f9;
          margin: 10px 0;
          padding: 10px;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
          transition: var(--hover-transition)
        }
        #chatGPT-wrapper ul li:hover{
          transform: var(--hover-scale)
        }
    `,
    buildContent: function (data) {
      return `
            <h2>Todo Item</h2>
            <div id="tododata">
            <ul>
            <li>
              <p>Task ID: ${data.id}</p>
              <p>Title: ${data.title}</p>
              <p id="status">Completed: ${data.completed}</p>
              </li>
              <li>
              <p>Task ID: Manual</p>
              <p>Title: Update Documentation!</p>
              <p id="status">Completed: in-progress</p>
              </li>
            </ul>
            </div>
            <span> a vanillaScoop by chatGPT</span>
            <p id="description">chatGPT generated a basic working component registering vanillaScoop. It fetches data form <code>typicode.com</code> and displays it in this HTML card.</p>
        `;
    },
  });
});
