ë.frozenVanilla("gptScoop", async function (paramObject) {
  const { apiUrl, data, targetSelector, buildContent, className, css } =
    paramObject;

  try {
    let fetchedData = null;
    if (apiUrl) {
      const response = await fetch(apiUrl);
      fetchedData = await response.json();
    } else if (data) {
      fetchedData = data;
    }

    const targetElement = document.querySelector(targetSelector);

    if (targetElement) {
      if (className) {
        targetElement.className = className;
      }

      const content = buildContent
        ? buildContent(fetchedData)
        : fetchedData
        ? JSON.stringify(fetchedData, null, 2)
        : "<p>No data available</p>";
      targetElement.innerHTML = content;

      if (css) {
        const style = document.createElement("style");
        const nonce = ë.nonceBack();
        style.setAttribute("nonce", nonce);
        style.textContent = css;
        document.head.appendChild(style);
        targetElement.setAttribute("data-nonce", nonce);
      }
    } else {
      console.error(`Target element '${targetSelector}' not found.`);
    }
  } catch (error) {
    console.error(`Failed to fetch data from '${apiUrl}':`, error);
  }
});
