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

export function initGameUI(config, reward) {
  initGameLogic(config, reward);
  renderBoard();
  updateFlagCountUI();
  timerEl.textContent = "0";
  messageEl.textContent = "";
  messageEl.className = "message";
  hiddenContentEl.classList.remove("visible");
  restartButtonEl.classList.remove("visible");

  // Check if this puzzle was already solved
  revealSolvedSecrets();
}

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
  if (gameOver || revealed[row][col] || flagged[row][col]) return;

  if (isFirstClick()) {
    placeMines(row, col);
    setFirstClick(false);
    startTimerLogic(updateTimerUI);
  }

  const revealedCells = revealCellLogic(row, col);
  revealedCells.forEach(cellData => {
    const cellEl = document.querySelector(`[data-row="${cellData.row}"][data-col="${cellData.col}"]`);
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
