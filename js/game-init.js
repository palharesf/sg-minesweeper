import { decodeGameConfig } from "./utils.js";
import { initGameUI } from "./game-ui.js";
import { configs } from "./game-logic.js";

document.addEventListener("DOMContentLoaded", () => {
  const gameConfigData = decodeGameConfig(window.location.hash);

  let config = null;
  let rewardUrl = "";

  if (gameConfigData) {
    config = gameConfigData.config;
    rewardUrl = gameConfigData.rewardUrl;
    initGameUI(config, rewardUrl);
  } else {
    // Redirect to creator page if no valid config in URL
    window.location.href = "index.html";
  }
});