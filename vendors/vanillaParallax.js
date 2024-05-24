window.frozenVanilla("vanillaParallax", function (parallaxConfig) {
  // Validate input
  if (
    !parallaxConfig.targets ||
    !parallaxConfig.range ||
    !parallaxConfig.speed ||
    !Array.isArray(parallaxConfig.targets) ||
    !parallaxConfig.max
  ) {
    throw new Error("Invalid parallax configuration");
  }

  // Calculate speed for an element
  function calculateSpeed(index, range, speed, totalElements) {
    return (range / totalElements) * index * speed;
  }

  // Apply parallax effect to an element
  function applyParallax(element, speed, max) {
    const parallaxElement = document.querySelector(element);
    if (parallaxElement) {
      window.addEventListener("scroll", function () {
        let offset = window.scrollY / window.innerHeight;
        if (offset * speed > max) {
          parallaxElement.style.transform = "translateY(" + max + "px)";
        } else {
          parallaxElement.style.transform =
            "translateY(" + offset * speed + "px)";
        }
      });
    }
  }

  // Apply parallax effect to each element
  parallaxConfig.targets.forEach((element, index) => {
    let speed = calculateSpeed(
      index,
      parallaxConfig.range,
      parallaxConfig.speed,
      parallaxConfig.targets.length
    );
    applyParallax(element, speed, parallaxConfig.max);
  });
});
