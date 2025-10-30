// Handles DOM manipulation and rendering for the Minesweeper game

import {
  revealed,
  flagged,
  gameOver,
  gameWon,
  isFirstClick,
  setFirstClick,
  gameConfig,
  rewardLink,
  initGameLogic,
  placeMines,
  revealCellLogic,
  toggleFlagLogic,
  checkWinLogic,
  startTimerLogic,
  stopTimerLogic,
  getFlagCount,
  getBoard,
  getRevealed,
} from "./game-logic.js";

import {
  encodeGameConfig,
  isPuzzleSolved,
  markPuzzleAsSolved,
} from "./utils.js";

// DOM elements
const gameBoardEl = document.getElementById("game-board");
const flagCountEl = document.getElementById("flag-count");
const mineCountEl = document.getElementById("mine-count");
const timerEl = document.getElementById("timer");
const messageEl = document.getElementById("message");
const hiddenContentEl = document.getElementById("hidden-content");
const restartButtonEl = document.getElementById("restart-button");

// Event listeners
restartButtonEl.addEventListener("click", () =>
  initGameUI(gameConfig, rewardLink)
);

document
  .getElementById("rules-container")
  .addEventListener("click", function () {
    const rulesList = document.getElementById("rules-list");
    const container = document.getElementById("rules-container");

    rulesList.classList.toggle("visible");
    container.classList.toggle("expanded");
  });

let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (gameConfig) {
      renderBoard();
    }
  }, 250);
});

// Public Functions
export function initGameUI(config, reward) {
  initGameLogic(config, reward);
  renderBoard();
  updateFlagCountUI();
  timerEl.textContent = "0";
  messageEl.textContent = "";
  messageEl.className = "message";
  hiddenContentEl.classList.remove("visible");
  restartButtonEl.classList.remove("visible");

  // Re-enable the game board in case it was disabled
  enableGameBoard();

  // Check if this puzzle was already solved
  revealSolvedSecrets();
}

// Private Functions
function renderBoard() {
  gameBoardEl.innerHTML = "";
  
  const cellSize = calculateCellSize();
  gameBoardEl.style.gridTemplateColumns = `repeat(${gameConfig.cols}, ${cellSize}px)`;
  gameBoardEl.style.setProperty("--cell-size", `${cellSize}px`);

  mineCountEl.textContent = gameConfig.mines;

  for (let i = 0; i < gameConfig.rows; i++) {
    for (let j = 0; j < gameConfig.cols; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = i;
      cell.dataset.col = j;

      cell.addEventListener("click", () => handleCellClick(i, j));
      cell.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        handleRightClick(i, j);
      });

      gameBoardEl.appendChild(cell);
    }
  }
}

function handleCellClick(row, col) {
  // Prevents clicks if game is over or if the cell is already flagged
  if (gameOver || flagged[row][col]) return;

  // Place mines on first click
  if (isFirstClick()) {
    placeMines(row, col);
    setFirstClick(false);
    startTimerLogic(updateTimerUI);
  }

  // Chording: If clicking on a revealed numbered cell
  if (revealed[row][col] && !flagged[row][col]) {
    const cellValue = getBoard()[row][col];

    // Only chord on numbered cells
    if (cellValue > 0) {
      // Count adjacent flags
      let adjacentFlags = 0;
      const neighbors = [];

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;

          const newRow = row + i;
          const newCol = col + j;

          if (
            newRow >= 0 &&
            newRow < gameConfig.rows &&
            newCol >= 0 &&
            newCol < gameConfig.cols
          ) {
            neighbors.push({ row: newRow, col: newCol });
            if (flagged[newRow][newCol]) {
              adjacentFlags++;
            }
          }
        }
      }

      // If flag count matches the number, reveal all unrevealed neighbors
      if (adjacentFlags === cellValue) {
        neighbors.forEach(({ row: nRow, col: nCol }) => {
          if (!revealed[nRow][nCol] && !flagged[nRow][nCol]) {
            const revealedCells = revealCellLogic(nRow, nCol);
            revealedCells.forEach((cellData) => {
              const cellEl = document.querySelector(
                `[data-row="${cellData.row}"][data-col="${cellData.col}"]`
              );
              cellEl.classList.add("revealed");
              if (cellData.value === -1) {
                cellEl.textContent = "💣";
                cellEl.classList.add("mine");
              } else if (cellData.value > 0) {
                cellEl.textContent = cellData.value;
                cellEl.classList.add(`number-${cellData.value}`);
              }
            });
          }
        });

        // Check game state after chording
        if (gameOver) {
          endGameUI(gameWon);
          return;
        } else {
          checkWinUI();
          return;
        }
      }
    }
    return; // Don't proceed with normal click logic for revealed cells
  }

  // If not chording, proceed with normal click
  const revealedCells = revealCellLogic(row, col);
  revealedCells.forEach((cellData) => {
    const cellEl = document.querySelector(
      `[data-row="${cellData.row}"][data-col="${cellData.col}"]`
    );
    cellEl.classList.add("revealed");
    if (cellData.value === -1) {
      cellEl.textContent = "💣";
      cellEl.classList.add("mine");
    } else if (cellData.value > 0) {
      cellEl.textContent = cellData.value;
      cellEl.classList.add(`number-${cellData.value}`);
    }
  });

  if (gameOver) {
    endGameUI(gameWon);
  } else {
    checkWinUI();
  }
}

function handleRightClick(row, col) {
  if (gameOver || revealed[row][col]) return;

  if (toggleFlagLogic(row, col)) {
    const cellEl = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (flagged[row][col]) {
      cellEl.classList.add("flagged");
      cellEl.textContent = "🚩";
    } else {
      cellEl.classList.remove("flagged");
      cellEl.textContent = "";
    }
    updateFlagCountUI();
    checkWinUI();
  }
}

function updateFlagCountUI() {
  flagCountEl.textContent = getFlagCount();
}

function updateTimerUI(currentTimer) {
  timerEl.textContent = currentTimer;
}

function checkWinUI() {
  if (checkWinLogic()) {
    endGameUI(true);
  }
}

function endGameUI(won) {
  stopTimerLogic();
  if (won) {
    messageEl.textContent = "🎉 You won!";
    messageEl.className = "message win";
    hiddenContentEl.classList.add("visible");
    document.getElementById("reward-content").textContent = rewardLink;

    // Mark this puzzle as solved in localStorage
    const currentPuzzleId = encodeGameConfig(gameConfig, rewardLink);
    markPuzzleAsSolved(currentPuzzleId);
  } else {
    messageEl.textContent = "💥 Game Over! You hit a mine.";
    messageEl.className = "message lose";
    restartButtonEl.classList.add("visible");
    revealAllMinesUI();
  }
}

function revealAllMinesUI() {
  const currentBoard = getBoard();
  const currentRevealed = getRevealed();
  for (let i = 0; i < gameConfig.rows; i++) {
    for (let j = 0; j < gameConfig.cols; j++) {
      if (currentBoard[i][j] === -1 && !currentRevealed[i][j]) {
        const cellEl = document.querySelector(
          `[data-row="${i}"][data-col="${j}"]`
        );
        cellEl.classList.add("revealed", "mine");
        cellEl.textContent = "💣";
      }
    }
  }
}

function calculateCellSize() {
  const maxCellSize = 40;
  const minCellSize = 18;
  const padding = 40; // Account for container padding

  const containerWidth = gameBoardEl.parentElement.clientWidth - padding;
  const containerHeight = window.innerHeight - 300; // Reserve space for header and controls

  const cellWidthByContainer = Math.floor(containerWidth / gameConfig.cols);
  const cellHeightByContainer = Math.floor(containerHeight / gameConfig.rows);

  const calculatedSize = Math.min(
    cellWidthByContainer,
    cellHeightByContainer,
    maxCellSize
  );

  return Math.max(calculatedSize, minCellSize);
}

function revealSolvedSecrets() {
  const currentPuzzleId = encodeGameConfig(gameConfig, rewardLink);
  if (isPuzzleSolved(currentPuzzleId)) {
    // Auto-reveal the secret for previously solved puzzles
    messageEl.textContent = "✨ Previously solved! Secret revealed below.";
    messageEl.className = "message win";
    hiddenContentEl.classList.add("visible");
    document.getElementById("reward-content").textContent = rewardLink;

    // Enable the replay button and disable the game board (so the only way to play it again is by resetting it)
    disableGameBoard();
    showReplayOption(currentPuzzleId);
  }
}

function showReplayOption(puzzleId) {
  const replayButton = document.createElement("button");
  replayButton.textContent = "Play this puzzle again";
  replayButton.className = "replay-button";
  replayButton.addEventListener("click", () => {
    // Confirm with the user before clearing progress
    const confirmed = confirm(
      "This will remove this puzzle from your solved list and hide the secret again. " +
        "You'll need to solve it again to reveal the secret. Continue?"
    );

    if (confirmed) {
      // Remove this specific puzzle from solved list
      const solvedPuzzles = JSON.parse(
        localStorage.getItem("solvedPuzzles") || "[]"
      );
      const filtered = solvedPuzzles.filter((id) => id !== puzzleId);
      localStorage.setItem("solvedPuzzles", JSON.stringify(filtered));

      // Reload the game
      initGameUI(gameConfig, rewardLink);
    }
  });

  // Insert button in the hidden content area instead of the message
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "replay-button-container";
  buttonContainer.appendChild(replayButton);
  hiddenContentEl.insertBefore(buttonContainer, hiddenContentEl.firstChild);
}

function disableGameBoard() {
  // Add a CSS class to visually indicate the board is disabled
  gameBoardEl.classList.add("disabled");

  // Remove pointer events to prevent any interaction
  gameBoardEl.style.pointerEvents = "none";

  // Optional: Add a semi-transparent overlay effect via CSS
  gameBoardEl.style.opacity = "0.6";
}

function enableGameBoard() {
  // Remove the disabled class
  gameBoardEl.classList.remove("disabled");

  // Enable pointer events
  gameBoardEl.style.pointerEvents = "auto";

  // Reset opacity
  gameBoardEl.style.opacity = "1";
}