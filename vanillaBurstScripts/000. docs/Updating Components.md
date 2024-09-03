setting dynamic tag and classNames, should be used only on class selectors, typically in an existing container div

          ë.updateComponent(
            vanillaPromise,
            {
              clear: true,
              position: 0,
              tag: "div",
              classNames: "signal-removed",
              html: [
                "You have removed this signal for this session.",
                "You have removed this signal for this session.",
              ],
            },
            "myweather",
            ".timer-info-container"
          );
