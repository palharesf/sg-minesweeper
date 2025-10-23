import { encodeGameConfig } from "./utils.js";
import { configs } from "./game-logic.js";

document.addEventListener("DOMContentLoaded", () => {
  const difficultySelect = document.getElementById("difficulty-creator");
  const rewardUrlInput = document.getElementById("reward-url");
  const generateLinkBtn = document.getElementById("generate-link-btn");
  const generatedLinkPanel = document.querySelector(".generated-link-panel");
  const shareableLinkInput = document.getElementById("shareable-link");
  const copyLinkBtn = document.getElementById("copy-link-btn");

  generateLinkBtn.addEventListener("click", () => {
    const selectedDifficulty = difficultySelect.value;
    const rewardUrl = rewardUrlInput.value;

    if (!rewardUrl) {
      alert("Please enter a destination URL for the reward.");
      return;
    }

    const config = configs[selectedDifficulty];
    if (!config) {
      alert("Invalid difficulty selected.");
      return;
    }

    const encodedConfig = encodeGameConfig(config, rewardUrl);
    const shareableLink = `${window.location.origin}/sg-minesweeper/game.html#${encodedConfig}`;

    shareableLinkInput.value = shareableLink;
    generatedLinkPanel.style.display = "block";
  });

  copyLinkBtn.addEventListener("click", () => {
    shareableLinkInput.select();
    shareableLinkInput.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand("copy");
    alert("Link copied to clipboard!");
  });
});