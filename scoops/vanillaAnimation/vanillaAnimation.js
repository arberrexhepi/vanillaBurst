ë.frozenVanilla("vanillaAnimation", async function (animationConfigs) {
  let index = 0;
  let scoopTag = "[Scoop][vanillaAnimation]";
  try {
    index++;

    runVanillaAnimation(animationConfigs);
  } catch (error) {
    ë.vanillaMess("[vendorScoop] vanillaAnimation: ", error, "check");
  }

  function runVanillaAnimation(animationConfigs) {
    //check if config

    if (typeof animationConfigs === "object" && animationConfigs !== null) {
      animationConfigs = Object.values(animationConfigs);
    } else {
      ë.vanillaMess("[vendorScoop] vanillaAnimation: ", error, "check");

      throw new Error(error);
    }

    //////process animaiton configs and applyAnimation
    function processAnimationConfig(animationConfigs) {
      animationConfigs.forEach((animationConfig, index) => {
        if (
          typeof animationConfig.target !== "string" ||
          typeof animationConfig.speed !== "number" ||
          !Array.isArray(animationConfig.effects) ||
          typeof animationConfig.duration !== "number"
        ) {
          ë.vanillaMess(
            scoopTag + ": Target Check:",
            animationConfig.target,
            "string"
          );
          ë.vanillaMess(
            scoopTag + ": Speed Check:",
            animationConfig.speed,
            "number"
          );
          ë.vanillaMess(
            scoopTag + ": Effects Check:",
            animationConfig.effects,
            "array"
          );
          ë.vanillaMess(
            scoopTag + ": Duration Check:",
            animationConfig.duration,
            "number"
          );

          throw new Error(`Invalid parallax configuration at index ${index}`);
        }

        //variable check tested successfully
        // set3DScaleVariables(animationConfig, false);

        animationActionInit(animationConfig);
      });
    }
    processAnimationConfig(animationConfigs);
    //////////////////////////////

    function animationActionInit(animationConfig) {
      let classPart = animationConfig.target.split(".");
      let idPart = animationConfig.target.split("#");
      let selectorType = idPart[1] ? "#" : classPart[1] ? "." : null;
      let selector = idPart[1] ? idPart[1] : classPart[1] ? classPart[1] : null;

      if (!selector) {
        console.error("Invalid selector:", animationConfig.target);
        ë.vanillaMess(scoopTag + ": Invalid Selector", false, "false");
        return;
      }

      let animationTarget;
      if (selectorType === "#") {
        animationTarget = document.getElementById(selector);
      } else if (selectorType === ".") {
        animationTarget = document.getElementsByClassName(selector)[0];
      } else {
        console.error("Unknown selector type:", selectorType);
        ë.vanillaMess("");
        return;
      }

      let initialTransform = 1;
      let initialScaleParse = 1;

      if (animationTarget instanceof Element) {
        initialTransform =
          window.getComputedStyle(animationTarget).transform || 1;
        const initialScaleMatch = initialTransform.match(/matrix\((.+)\)/);
        initialScaleParse = initialScaleMatch
          ? parseFloat(initialScaleMatch[1].split(", ")[0])
          : 1;
      } else {
        //console.error("animationTarget is not an Element:", animationTarget);
      }

      ///////////////////computed initials

      let rect;
      if (animationTarget instanceof Element) {
        rect = animationTarget.getBoundingClientRect();
      } else if (animationTarget instanceof Text) {
        let range = document.createRange();
        range.selectNode(animationTarget);
        rect = range.getBoundingClientRect();
      } else if (animationTarget instanceof HTMLImageElement) {
        rect = animationTarget.getBoundingClientRect();
      } else {
        return;
      }

      const originalTop = window.scrollY + rect.top || 0;

      // ///////Append computed & static-set Initials to animationConfig
      let canvasPositionDeltas = {};

      let initialScale = animationConfig?.initialScale
        ? animationConfig.initialScale
        : 1;
      if (!canvasPositionDeltas.originalTop) {
        canvasPositionDeltas["originalTop"] = 1;
      }

      if (!canvasPositionDeltas.initialScale) {
        canvasPositionDeltas["initialScale"] = 1;
      }
      let currentScrollPosition = window.scrollY;
      let ticking = false;
      if (!canvasPositionDeltas.lastKnownScrollPosition) {
        canvasPositionDeltas["lastKnownScrollPosition"] = window.scrollY || 0;
      }
      if (!canvasPositionDeltas.lastKnownScrollDirection) {
        canvasPositionDeltas["lastKnownDirection"] = null;
      }
      canvasPositionDeltas.originalTop = originalTop; //static

      canvasPositionDeltas.initialScale = initialScale; //static

      canvasPositionDeltas.initialScale = initialScale; //stat

      canvasPositionDeltas.lastKnownScrollPosition = window.scrollY; //static

      // Apply on scroll (maybe an event type switch in the future!)

      switch (animationConfig.play) {
        case "play":
          animationBuild(animationConfig);
          break;
        case "scroll":
          window.addEventListener(
            "scroll",
            throttle(() => {
              let lastKnownScrollPosition =
                canvasPositionDeltas?.lastKnownScrollPosition
                  ? canvasPositionDeltas.lastKnownScrollPosition
                  : window.scrollY;
              let currentScrollPosition = window.scrollY;
              let scrollDirection =
                currentScrollPosition > lastKnownScrollPosition ? "down" : "up";

              // Only run animationBuild if the scroll direction has changed
              if (canvasPositionDeltas.lastKnownDirection !== scrollDirection) {
                canvasPositionDeltas.lastKnownDirection = scrollDirection;
                canvasPositionDeltas.lastKnownScrollPosition =
                  currentScrollPosition;

                if (!ticking) {
                  window.requestAnimationFrame(() => {
                    let offset = lastKnownScrollPosition / window.innerHeight;

                    if (!animationConfig.offset) {
                      animationConfig["offset"] = null;
                    }
                    animationConfig.offset = offset;

                    animationConfig.lastScrollTop =
                      animationConfig.lastKnownScrollPosition; // Update lastScrollTop

                    animationBuild(animationConfig, canvasPositionDeltas);
                    ticking = false;
                  });

                  ticking = true;
                }
              }

              lastKnownScrollPosition = currentScrollPosition;
            }, 1000)
          );
          break;
        default:
      }

      // Throttle function to limit the frequency of event handling
      function throttle(callback, limit) {
        let wait = false;
        return function () {
          if (!wait) {
            callback.call();
            wait = true;
            setTimeout(() => {
              wait = false;
            }, limit);
          }
        };
      }
    }

    function animationBuild(animationConfig, canvasPositionDeltas) {
      if (animationConfig.play === "scroll") {
        if (
          animationConfig.max &&
          (canvasPositionDeltas.lastScrollDirection !==
            canvasPositionDeltas.lastKnownScrollDirection ||
            Math.abs(
              canvasPositionDeltas.lastScrollTop -
                canvasPositionDeltas.currentScrollPosition
            ) < 50)
        ) {
          return;
        }
      }

      ///////////run effects chain

      let effectList;
      if (typeof animationConfig.effects === "string") {
        effectList = [animationConfig.effects];
      } else if (Array.isArray(animationConfig.effects)) {
        effectList = animationConfig.effects;
      } else {
        effectList = ["zoom-in"];
      }

      function handleEffects(animationConfig, effectList) {
        // Get the current and last known direction
        //
        // Get the last known scroll position

        if (animationConfig.play === "scroll") {
          let lastKnownScrollPosition =
            canvasPositionDeltas.lastKnownScrollPosition;

          // Get the current scroll position
          let currentScrollPosition = window.scrollY;

          // Determine the scroll direction
          let currentDirection =
            currentScrollPosition > lastKnownScrollPosition ? "down" : "up";

          // Update canvasPositionDeltas
          canvasPositionDeltas.lastKnownDirection = currentDirection;
          canvasPositionDeltas.lastKnownScrollPosition = currentScrollPosition;

          let lastKnownDirection = canvasPositionDeltas.lastKnownDirection;

          // Get the count
          let count = canvasPositionDeltas.count;

          // Check if the current direction is the same as the last known direction
          if (currentDirection === lastKnownDirection && count > 1) {
            // If the directions are the same and count is higher than 1, do nothing
            return;
          } else if (count > 1) {
            // If count is higher than 1 and the directions are not the same, reverse the animation
            animationConfig.direction = "reverse";
          }
        }
        if (Array.isArray(effectList)) {
          let results = [];
          let lastEffect;
          let animationTarget =
            animationConfig.target.split("#")[1] ||
            animationConfig.target.split(".")[1];

          effectList.forEach((effect) => {
            let result = effectSwitch(animationConfig, effect);
            if (result) {
              results.push(result);
              lastEffect = effect + "-" + animationTarget;
              ë.vanillaMess(
                scoopTag + " Effect check: " + effect,
                effect,
                "string"
              );
            }
          });

          if (results.length > 0) {
            return lastEffect;
          }
        } else {
          ë.vanillaMess(
            scoopTag + " Effect not found: " + effect,
            effect,
            "string"
          );
          throw new Error("Invalid effect type");
        }
      }

      function effectSwitch(animationConfig, effect, canvasPositionDeltas) {
        let animationTarget =
          animationConfig.target.split("#")[1] ||
          animationConfig.target.split(".")[1];

        switch (effect) {
          case "pan":
            let existingPanStyleTag = Array.from(
              document.head.getElementsByTagName("style")
            ).find((style) => style.dataset.animationName === animationTarget);

            if (!existingPanStyleTag) {
              let panKeyframes = `
  0% {
    transform: translate3d(
      var(--positionStartX-${animationTarget}), 
      var(--positionStartY-${animationTarget}), 
      var(--positionStartZ-${animationTarget})
    );
  }
  100% {
    transform: translate3d(
      var(--positionFinishX-${animationTarget}), 
      var(--positionFinishY-${animationTarget}), 
      var(--positionFinishZ-${animationTarget})
    );
  }
`;

              let cssClass = `  .pan-${animationTarget}{
  animation: animation-pan-${animationTarget} var(--duration-${animationTarget})  var(--motion-${animationTarget}) var(--repeat-count-${animationTarget}) var(--play-direction-${animationTarget});
  z-index: var(--z-index-${animationTarget});
}`;

              let style = document.createElement("style");
              style.dataset.animationName = effect + "-" + animationTarget;
              style.nonce = ë.nonceBack();

              style.textContent = `
  ${cssClass}
  @keyframes animation-pan-${animationTarget} {
    ${panKeyframes}
  }
`;

              document.head.appendChild(style);
            }

            return processPan(
              animationConfig,
              effect,
              canvasPositionDeltas,
              animationTarget
            );
          case "zoom":
            let existingZoomStyleTag = Array.from(
              document.head.getElementsByTagName("style")
            ).find(
              (existingZoomStyleTag) =>
                existingZoomStyleTag.dataset.animationName === animationTarget
            );

            if (!existingZoomStyleTag) {
              let zoomKeyframes = `
            0% {
              transform: scale3d(var(--scaleStart-${animationTarget}));
          }
          100% {
              transform: scale3d(var(--scaleFinish-${animationTarget}));
          }
        `;

              let zoomClass = `  .zoom-${animationTarget}{
          animation: animation-zoom-${animationTarget} var(--duration-${animationTarget})  var(--motion-${animationTarget}) var(--repeat-count-${animationTarget}) var(--play-direction-${animationTarget});
          z-index: var(--z-index-${animationTarget});
        }`;

              let styleZoom = document.createElement("style");
              styleZoom.nonce = ë.nonceBack();
              styleZoom.dataset.animationName = effect + "-" + animationTarget;
              styleZoom.textContent = `
    ${zoomClass}
    @keyframes animation-zoom-${animationTarget} {
      ${zoomKeyframes}
    }
  `;
              ë.vanillaMess("at append stylezoom", true, "boolean");
              document.head.appendChild(styleZoom);
            }
            return processZoom(
              animationConfig,
              effect,
              canvasPositionDeltas,
              animationTarget
            );
            break;
          case "bloom":
            break;
          case "swirl":
            break;
          default:
            throw new Error("Invalid effect");
        }
      }

      return new Promise((resolve, reject) => {
        let cssBUILD = handleEffects(
          animationConfig,
          effectList,
          canvasPositionDeltas
        );

        ///////WORKING HERE

        if (cssBUILD) {
          resolve(cssBUILD);
        } else {
        }
      })
        .then((cssBUILD) => {
          let targetElements = document.querySelectorAll(
            animationConfig.target
          );
          //targetElements.forEach((element) => element.classList.add(cssBUILD));

          let targetElementSpawns = document.querySelectorAll(
            animationConfig.target + "-newElement"
          );

          if (targetElementSpawns && targetElementSpawns.length > 0) {
            targetElements.forEach((element) => {
              element.classList.add(cssBUILD);
              void element.offsetWidth; // force a reflow
            });
            targetElementSpawns.forEach((element) => {
              setTimeout(function () {
                element.classList.remove("spawn");
                element.classList.add(cssBUILD);
                void element.offsetWidth; // force a reflow
              }, animationConfig.duration * animationConfig.speed +
                animationConfig.duration * animationConfig.speed * 500);
            });
          }
        })
        .catch((error) => {
          throw new Error(error);
        });

      ////BUILD CSS STRINGS for CSS ANIMATIONS
    }
    function setAnimationRootVariables(animationConfig, animationTarget) {
      let root = document.documentElement;

      // Set the value of the --initial, --offset, --animation-duration, --z-index variables

      root.style.setProperty("--offset", animationConfig.offset);

      let elementCount;

      if (animationConfig.spawn) {
        elementCount = animationConfig.spawn[1];
      }
      root.style.setProperty(
        `--duration-${animationTarget}`,
        `${animationConfig.duration * animationConfig.speed}s`
      );
      root.style.setProperty(
        `--motion-${animationTarget}`,
        animationConfig.motion
      );
      root.style.setProperty(
        `--animation-speed-${animationTarget}`,
        `${animationConfig.speed}s`
      );
      root.style.setProperty(
        `--repeat-count-${animationTarget}`,
        animationConfig.repeatCount
      );
      root.style.setProperty(
        `--z-index-${animationTarget}`,
        animationConfig.zIndex
      );

      if (animationConfig.loop) {
        // Determine startDirection and loopDirection based on animationConfig.loop
        let startDirection =
          animationConfig.loop[0] === "normal"
            ? 0
            : animationConfig.loop[0] === "reverse"
            ? 1
            : 0;

        ë.registerInterval(
          animationConfig.target + "watchingDirection",
          () => {
            root.style.setProperty(
              `--play-direction-${animationTarget}`,
              animationConfig.loop[0]
            );
          },
          animationConfig?.repeatCount || null,
          animationConfig.duration * animationConfig.speed * 1000,
          (repeat = true),
          () => {
            startDirection = 1 - startDirection;

            root.style.setProperty(
              `--play-direction-${animationTarget}`,
              animationConfig.loop[startDirection]
            );
          },
          null
        );
      }
    }

    function set3DScaleVariables(animationConfig, chain, animationTarget) {
      let root = document.documentElement;

      // Calculate the scaleStart and scaleFinish values based on the offset
      let scaleStart = animationConfig.scaleStart.map(
        (value) => value * animationConfig.offset
      );
      let scaleFinish = animationConfig.scaleFinish.map(
        (value) => value * animationConfig.offset
      );

      // Set the value of the --initial, --offset, --animation-duration, --z-index variables
      root.style.setProperty(
        `--initial-${animationTarget}`,
        animationConfig.initial
      );

      // Set the value of the --scaleStart and --scaleFinish variables
      root.style.setProperty(
        `--scaleStart-${animationTarget}`,
        scaleStart.join(",")
      );
      root.style.setProperty(
        `--scaleFinish-${animationTarget}`,
        scaleFinish.join(",")
      );

      // Set the transform property of the target element to the final scale values
      if (animationConfig.target) {
        let targetDOM = document.querySelector(animationConfig.target);
        targetDOM.style.transform = `scale3d(${scaleFinish.join(",")})`;
        targetDOM.style.zIndex = animationConfig.zIndex;
      }
      if (chain === true) {
        return true;
      }
    }

    function setPositionVariables(animationConfig, animationTarget, chain) {
      ë.vanillaMess("checking position", true, "boolean");
      let root = document.documentElement;

      // Calculate the positionStart and positionFinish values based on the offset
      let positionStart = animationConfig.positionStart.map(
        (value) => value * animationConfig.offset
      );
      let positionFinish = animationConfig.positionFinish.map(
        (value) => value * animationConfig.offset
      );

      // Set the value of the --initial, --offset, --animation-duration, --z-index variables
      root.style.setProperty(
        `--initial-${animationTarget}`,
        animationConfig.initial
      );

      // Set the value of the --positionStartX, --positionStartY, --positionStartZ, --positionFinishX, --positionFinishY, --positionFinishZ variables
      root.style.setProperty(
        `--positionStartX-${animationTarget}`,
        positionStart[0] + animationConfig.units[0]
      );
      root.style.setProperty(
        `--positionStartY-${animationTarget}`,
        positionStart[1] + animationConfig.units[1]
      );
      root.style.setProperty(
        `--positionStartZ-${animationTarget}`,
        positionStart[2] + animationConfig.units[2]
      );
      root.style.setProperty(
        `--positionFinishX-${animationTarget}`,
        positionFinish[0] + animationConfig.units[0]
      );
      root.style.setProperty(
        `--positionFinishY-${animationTarget}`,
        positionFinish[1] + animationConfig.units[1]
      );
      root.style.setProperty(
        `--positionFinishZ-${animationTarget}`,
        positionFinish[2] + animationConfig.units[2]
      );

      // Set the transform property of the target element to the final position values
      if (animationConfig.target) {
        let targetDOM = document.querySelector(animationConfig.target);
        let parentOfTargetDOM = targetDOM.parentNode;
        parentOfTargetDOM.style.zIndex = animationConfig.zIndex;
        targetDOM.style.transform = `translate3d(${
          positionFinish[0] + animationConfig.unit
        }, ${positionFinish[1] + animationConfig.unit}, ${
          positionFinish[2] + animationConfig.unit
        })`;
        if (animationConfig.spawn) {
          let [direction, amount] = animationConfig.spawn;

          for (let i = 1; i <= amount; i++) {
            let newElement = document.createElement("div"); // Change 'div' to the type of element you want to create
            newElement.innerHTML = targetDOM.innerHTML;
            newElement.classList.add("spawn");
            parentOfTargetDOM.appendChild(newElement);
            newElement.id =
              "#" + animationConfig.target.split(".")[1] + (i + 1);
            newElement.classList.add(
              animationConfig.target.split(".")[1] + "-newElement"
            );
            newElement.setAttribute(`data-spawnIndex-${animationTarget}`, i);
            let offset = i * animationConfig.spawn[1]; // Adjust this value to change the offset between newElements

            let positionFinish = [
              animationConfig.positionStart[0],
              animationConfig.positionStart[1],
              animationConfig.positionStart[2],
            ];

            root.style.setProperty(
              `--spawnIndex-${animationTarget}`,
              amount + 1
            );

            switch (direction) {
              case "up":
                newElement.style.transform = `translate3d(${
                  positionFinish[0] + animationConfig.unit
                }, ${positionFinish[1] * -index + animationConfig.unit}, ${
                  positionFinish[2] + animationConfig.unit
                })`;
                break;
              case "down":
                newElement.style.transform = `translate3d(${
                  positionFinish[0] + animationConfig.unit
                }, ${positionFinish[1] + offset + animationConfig.unit}, ${
                  positionFinish[2] + animationConfig.unit
                })`;
                break;
              case "left":
                newElement.style.transform = `translate3d(${
                  positionFinish[0] - offset + animationConfig.unit
                }, ${positionFinish[1] + animationConfig.unit}, ${
                  positionFinish[2] + animationConfig.unit
                })`;
                break;
              case "right":
                newElement.style.transform = `translate3d(${
                  positionFinish[0] + offset + animationConfig.unit
                }, ${positionFinish[1] + animationConfig.unit}, ${
                  positionFinish[2] + animationConfig.unit
                })`;
                break;
            }
          }
        }
      }
      if (chain === true) {
        return true;
      }
    }

    function processZoom(
      animationConfig,
      effect,
      canvasPositionDeltas,
      animationTarget
    ) {
      setAnimationRootVariables(animationConfig, effect);
      set3DScaleVariables(animationConfig);
      document
        .querySelector(animationConfig.target)
        .classList.add(effect + "-" + animationTarget);

      return true;
    }

    function processPan(
      animationConfig,
      effect,
      canvasPositionDeltas,
      animationTarget
    ) {
      setAnimationRootVariables(animationConfig, animationTarget);
      setPositionVariables(animationConfig, animationTarget);
      document
        .querySelector(animationConfig.target)
        .classList.add(effect + "-" + animationTarget);
      return true;
    }
  }
});
