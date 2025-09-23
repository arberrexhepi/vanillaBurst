ë.defineFrozenVanilla("addClipboardButton", function (codeBlock, index) {
  console.log(`Adding clipboard button to block ${index}`);

  // Check if button already exists
  if (codeBlock.querySelector(".clipboard-btn")) {
    console.log(`Clipboard button already exists for block ${index}`);
    return;
  }

  // Create clipboard button
  const clipboardBtn = document.createElement("button");
  clipboardBtn.className = "clipboard-btn";
  clipboardBtn.title = "Copy to clipboard";
  clipboardBtn.setAttribute("data-block-index", index);

  // Use simple emoji icons that work everywhere
  clipboardBtn.innerHTML = "📄";

  // Style the button with a favicon-like appearance
  clipboardBtn.style.position = "absolute";
  clipboardBtn.style.top = "12px";
  clipboardBtn.style.right = "12px";
  clipboardBtn.style.width = "28px";
  clipboardBtn.style.height = "28px";
  clipboardBtn.style.background = "#1a1a1a";
  clipboardBtn.style.color = "#ffffff";
  clipboardBtn.style.border = "1px solid #333";
  clipboardBtn.style.borderRadius = "4px";
  clipboardBtn.style.cursor = "pointer";
  clipboardBtn.style.fontSize = "14px";
  clipboardBtn.style.zIndex = "1000";
  clipboardBtn.style.display = "flex";
  clipboardBtn.style.alignItems = "center";
  clipboardBtn.style.justifyContent = "center";
  clipboardBtn.style.transition = "all 0.2s ease";
  clipboardBtn.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

  // Add hover effect
  clipboardBtn.addEventListener("mouseenter", () => {
    clipboardBtn.style.background = "#333";
    clipboardBtn.style.transform = "scale(1.1)";
    clipboardBtn.style.boxShadow = "0 4px 8px rgba(0,0,0,0.4)";
  });

  clipboardBtn.addEventListener("mouseleave", () => {
    clipboardBtn.style.background = "#1a1a1a";
    clipboardBtn.style.transform = "scale(1)";
    clipboardBtn.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
  });

  // Add click handler
  clipboardBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log(`Clipboard button clicked for block ${index}`);

    try {
      // Get text content, preserving formatting
      let textToCopy = codeBlock.textContent || codeBlock.innerText;

      // Clean up the text a bit
      textToCopy = textToCopy.trim();

      console.log("Text to copy length:", textToCopy.length);
      console.log("First 50 chars:", textToCopy.substring(0, 50));

      // Try multiple methods
      let copySuccess = false;

      // Method 1: Modern clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(textToCopy);
          copySuccess = true;
          console.log("✓ Copied using modern clipboard API");
        } catch (clipboardError) {
          console.log("Modern clipboard failed:", clipboardError);
        }
      }

      // Method 2: Fallback using textarea with selection range
      if (!copySuccess) {
        try {
          const textArea = document.createElement("textarea");
          textArea.value = textToCopy;
          textArea.style.position = "fixed";
          textArea.style.left = "-9999px";
          textArea.style.top = "-9999px";
          textArea.style.opacity = "0";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          textArea.setSelectionRange(0, 99999); // For mobile devices

          // Try modern approach first, then deprecated as last resort
          try {
            if (navigator.clipboard && window.isSecureContext) {
              await navigator.clipboard.writeText(textToCopy);
              copySuccess = true;
              console.log("✓ Copied using clipboard API in fallback");
            } else {
              // Only use deprecated method as absolute last resort
              const successful =
                document.execCommand && document.execCommand("copy");
              if (successful) {
                copySuccess = true;
                console.log(
                  "✓ Copied using deprecated execCommand (last resort)"
                );
              }
            }
          } catch (fallbackClipboardError) {
            console.log(
              "Fallback clipboard also failed:",
              fallbackClipboardError
            );
          }

          document.body.removeChild(textArea);

          if (!copySuccess) {
            console.log("All fallback methods failed");
          }
        } catch (fallbackError) {
          console.log("Fallback method failed:", fallbackError);
        }
      }

      if (copySuccess) {
        // Visual feedback - success
        clipboardBtn.innerHTML = "✅";
        clipboardBtn.style.background = "#22c55e";

        setTimeout(() => {
          clipboardBtn.innerHTML = "📄";
          clipboardBtn.style.background = "#1a1a1a";
        }, 2000);

        console.log("✓ Code copied to clipboard successfully!");
      } else {
        throw new Error("All copy methods failed");
      }
    } catch (err) {
      console.error("[clipboard] Error:", err);

      // Visual feedback - error
      clipboardBtn.innerHTML = "❌";
      clipboardBtn.style.background = "#ef4444";

      setTimeout(() => {
        clipboardBtn.innerHTML = "📄";
        clipboardBtn.style.background = "#1a1a1a";
      }, 2000);

      // Also show error in the UI
      showError("[clipboard] Error: " + err.message);
    }
  });

  // Ensure the code block has relative positioning
  if (getComputedStyle(codeBlock).position === "static") {
    codeBlock.style.position = "relative";
  }

  // Add the button to the code block
  codeBlock.appendChild(clipboardBtn);

  // Add nonce attribute for security
  clipboardBtn.setAttribute("nonce", ë.nonceBack());

  console.log(`✓ Clipboard button added successfully to block ${index}`);
});
