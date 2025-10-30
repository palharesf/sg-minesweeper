// Core Minesweeper game logic

import { isSolvable } from "./solver.js";

export const configs = {
  easy: { rows: 8, cols: 8, mines: 10 },
  medium: { rows: 12, cols: 12, mines: 20 },
  hard: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 30, cols: 16, mines: 99 },
};

export let board = [];
export let revealed = [];
export let flagged = [];
export let questionMark = [];
export let gameOver = false;
export let gameWon = false;
export let mineCount = 0;
export let timer = 0;
export let timerInterval = null;
export let gameConfig = null;
export let rewardLink = "";

// firstClick handlers, since firstClick is a local variable that needs to be modified by other modules

let firstClick = true;

export function setFirstClick(value) {
  firstClick = value;
}

export function isFirstClick() {
  return firstClick;
}

export function initGameLogic(config, reward) {
  gameConfig = config;
  rewardLink = reward;
  board = [];
  revealed = [];
  flagged = [];
  questionMark = [];
  gameOver = false;
  gameWon = false;
  setFirstClick(true);
  timer = 0;
  mineCount = config.mines;

  clearInterval(timerInterval);
  timerInterval = null;

  for (let i = 0; i < config.rows; i++) {
    board[i] = [];
    revealed[i] = [];
    flagged[i] = [];
    questionMark[i] = [];
    for (let j = 0; j < config.cols; j++) {
      board[i][j] = 0;
      revealed[i][j] = false;
      flagged[i][j] = false;
      questionMark[i][j] = false;
    }
  }
}

export function placeMines(excludeRow, excludeCol) {
  const maxAttempts = gameConfig.rows * gameConfig.cols > 400 ? 2000 : 1000;
  let attempt = 0;

  while (attempt < maxAttempts) {
    attempt++;

    // Reset board
    for (let i = 0; i < gameConfig.rows; i++) {
      for (let j = 0; j < gameConfig.cols; j++) {
        board[i][j] = 0;
      }
    }

    // Create forbidden zone around first click
    const forbiddenZone = new Set();
    const radius = gameConfig.rows >= 30 ? 2 : 1;
    for (let i = -radius; i <= radius; i++) {
      for (let j = -radius; j <= radius; j++) {
        const row = excludeRow + i;
        const col = excludeCol + j;
        if (
          row >= 0 &&
          row < gameConfig.rows &&
          col >= 0 &&
          col < gameConfig.cols
        ) {
          forbiddenZone.add(`${row},${col}`);
        }
      }
    }

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < gameConfig.mines) {
      const row = Math.floor(Math.random() * gameConfig.rows);
      const col = Math.floor(Math.random() * gameConfig.cols);

      if (forbiddenZone.has(`${row},${col}`) || board[row][col] === -1) {
        continue;
      }

      board[row][col] = -1;
      minesPlaced++;
    }

    // Calculate numbers for each cell
    for (let i = 0; i < gameConfig.rows; i++) {
      for (let j = 0; j < gameConfig.cols; j++) {
        if (board[i][j] !== -1) {
          board[i][j] = countAdjacentMines(i, j);
        }
      }
    }

    // Check if this layout is solvable using the solver
    if (
      isSolvable(
        board,
        gameConfig.rows,
        gameConfig.cols,
        excludeRow,
        excludeCol
      )
    ) {
      console.log(`✓ Found solvable grid on attempt ${attempt}`);
      return;
    }
  }

  // Fallback: if we couldn't find a solvable grid, use the last attempt
  alert(
    `⚠️ Unable to Generate Solvable Board\n\n` +
      `After ${maxAttempts} attempts, we couldn't create a board that's guaranteed to be solvable without guessing.\n\n` +
      `📊 Current density: ${(gameConfig.mines / (gameConfig.cols * gameConfig.rows) * 100).toFixed(1)}%\n` +
      `(${gameConfig.mines} mines in ${gameConfig.rows}×${gameConfig.cols} = ${
        gameConfig.rows * gameConfig.cols
      } cells)\n\n` +
      `💡 Suggestions:\n` +
      `• Reduce the number of mines\n` +
      `• Increase the board size\n` +
      `• Try generating again (results vary)\n\n` +
      `The current board uses the last attempt and may require guessing.`
  );
}

function countAdjacentMines(row, col) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;
      if (
        newRow >= 0 &&
        newRow < gameConfig.rows &&
        newCol >= 0 &&
        newCol < gameConfig.cols &&
        board[newRow][newCol] === -1
      ) {
        count++;
      }
    }
  }
  return count;
}

export function revealCellLogic(row, col) {
  if (revealed[row][col] || flagged[row][col]) return [];

  revealed[row][col] = true;
  const revealedCells = [{ row, col, value: board[row][col] }];

  if (board[row][col] === -1) {
    gameOver = true;
    gameWon = false;
  } else if (board[row][col] === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i;
        const newCol = col + j;
        if (
          newRow >= 0 &&
          newRow < gameConfig.rows &&
          newCol >= 0 &&
          newCol < gameConfig.cols
        ) {
          revealedCells.push(...revealCellLogic(newRow, newCol));
        }
      }
    }
  }
  return revealedCells;
}

export function toggleFlagLogic(row, col) {
  if (revealed[row][col]) return false;

  // Cycle through three states: empty → flagged → question mark → empty
  if (!flagged[row][col] && !questionMark[row][col]) {
    // State 1: Empty → Flagged
    flagged[row][col] = true;
  } else if (flagged[row][col]) {
    // State 2: Flagged → Question Mark
    flagged[row][col] = false;
    questionMark[row][col] = true;
  } else {
    // State 3: Question Mark → Empty
    questionMark[row][col] = false;
  }

  return true;
}

export function checkWinLogic() {
  let revealedCount = 0;
  for (let i = 0; i < gameConfig.rows; i++) {
    for (let j = 0; j < gameConfig.cols; j++) {
      if (revealed[i][j]) revealedCount++;
    }
  }

  if (revealedCount === gameConfig.rows * gameConfig.cols - gameConfig.mines) {
    gameOver = true;
    gameWon = true;
    return true;
  }
  return false;
}

export function startTimerLogic(onTick) {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    onTick(timer);
  }, 1000);
}

export function stopTimerLogic() {
  clearInterval(timerInterval);
  timerInterval = null;
}

export function getFlagCount() {
  let count = 0;
  flagged.forEach((row) => row.forEach((f) => (count += f ? 1 : 0)));
  return count;
}

export function getMineCount() {
  return mineCount;
}

export function getBoard() {
  return board;
}

export function getRevealed() {
  return revealed;
}

export function getFlagged() {
  return flagged;
}