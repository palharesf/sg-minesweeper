import { encodeGameConfig } from "./utils.js";
import { configs } from "./game-logic.js";

document.addEventListener("DOMContentLoaded", () => {
  const difficultySelect = document.getElementById("difficulty-creator");
  const rewardUrlInput = document.getElementById("reward-url");
  // Define custom input elements
  const customRowsInput = document.getElementById("custom-rows");
  const customColsInput = document.getElementById("custom-cols");
  const customMinesInput = document.getElementById("custom-mines");

  // Add change event listener for difficulty dropdown
  difficultySelect.addEventListener("change", () => {
    const customDifficultyInputs = document.getElementById("custom-difficulty-inputs");
    if (difficultySelect.value === "custom") {
      customDifficultyInputs.classList.remove("hidden-content");
    } else {
      customDifficultyInputs.classList.add("hidden-content");
    }
  });

  const generateLinkBtn = document.getElementById("generate-link-btn");
  const generatedLinkPanel = document.querySelector(".generated-link-panel");
  const shareableLinkInput = document.getElementById("shareable-link");
  const copyLinkBtn = document.getElementById("copy-link-btn");

  generateLinkBtn.addEventListener("click", () => {
    const selectedDifficulty = difficultySelect.value;
    const rewardUrl = rewardUrlInput.value;

    if (!rewardUrl) {
      alert("Please enter a secret.");
      return;
    }

    let config;
    if (selectedDifficulty === "custom") {
      const rows = parseInt(customRowsInput.value);
      const cols = parseInt(customColsInput.value);
      const mines = parseInt(customMinesInput.value);
      const totalCells = rows * cols;
      const density = mines / totalCells;
      const forbiddenZoneSize = rows >= 30 ? 25 : 9; // 5×5 or 3×3

      // Client-side input validation
      if (rows < 3 || rows > 30) {
        alert("Please enter a valid number of rows (3-30).");
        return;
      }
      if (cols < 3 || cols > 30) {
        alert("Please enter a valid number of columns (3-30).");
        return;
      }
      if (mines < 1 || mines >= rows * cols || mines > 150) {
        alert(
          "Please enter a valid number of mines (1 to rows * cols - 1, max 150)."
        );
        return;
      }

      // Check if physically possible
      if (mines >= totalCells - forbiddenZoneSize) {
        alert(
          `Too many mines! Maximum is ${
            totalCells - forbiddenZoneSize - 1
          } for a ${rows}×${cols} board.`
        );
        return;
      }

      // Check solvability likelihood
      if (density > 0.25) {
        alert(
          `⚠️ Very high mine density (${(density * 100).toFixed(1)}%)!\n\n` +
            `This board may be extremely difficult or impossible to generate. ` +
            `Generation could take a very long time or fail.\n\n` +
            `Consider reducing the number of mines.`
        );
        return false; // Prevent creation
      }

      if (density > 0.2) {
        const proceed = confirm(
          `⚠️ High mine density (${(density * 100).toFixed(1)}%)\n\n` +
            `Board generation may take 30-60 seconds or require multiple attempts.\n\n` +
            `Do you want to continue?`
        );

        if (!proceed) {
          return false; // User cancelled
        }
      } else if (density > 0.15) {
        const proceed = confirm(
          `ℹ️ Moderate mine density (${(density * 100).toFixed(1)}%)\n\n` +
            `Board generation may take a few seconds.\n\n` +
            `Do you want to continue?`
        );

        if (!proceed) {
          return false; // User cancelled
        }
      }

      config = { rows, cols, mines };
    } else {
      config = configs[selectedDifficulty];
    }

    if (!config) {
      alert("Invalid difficulty selected.");
      return;
    }

    const encodedConfig = encodeGameConfig(config, rewardUrl);
    const shareableLink = `${window.location.origin}/sg-minesweeper/game.html#${encodedConfig}`;

    shareableLinkInput.value = shareableLink;
    generatedLinkPanel.style.display = "block";
    shareableLinkInput.select();
  });

  copyLinkBtn.addEventListener("click", () => {
    shareableLinkInput.select();
    shareableLinkInput.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(shareableLinkInput.value).then(() => {
      copyLinkBtn.textContent = "Link Copied!";
    })
  });
});