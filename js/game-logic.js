// Core Minesweeper game logic

export const configs = {
  easy: { rows: 8, cols: 8, mines: 10 },
  medium: { rows: 12, cols: 12, mines: 20 },
  hard: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 30, cols: 16, mines: 99 },
};

export let board = [];
export let revealed = [];
export let flagged = [];
export let gameOver = false;
export let gameWon = false;
export let mineCount = 0;
export let timer = 0;
export let timerInterval = null;
export let gameConfig = null;
export let rewardLink = "";

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
    for (let j = 0; j < config.cols; j++) {
      board[i][j] = 0;
      revealed[i][j] = false;
      flagged[i][j] = false;
    }
  }
}

export function placeMines(excludeRow, excludeCol) {
  let minesPlaced = 0;
  while (minesPlaced < gameConfig.mines) {
    const row = Math.floor(Math.random() * gameConfig.rows);
    const col = Math.floor(Math.random() * gameConfig.cols);

    if ((row === excludeRow && col === excludeCol) || board[row][col] === -1) {
      continue;
    }

    board[row][col] = -1;
    minesPlaced++;
  }

  for (let i = 0; i < gameConfig.rows; i++) {
    for (let j = 0; j < gameConfig.cols; j++) {
      if (board[i][j] !== -1) {
        board[i][j] = countAdjacentMines(i, j);
      }
    }
  }
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
  flagged[row][col] = !flagged[row][col];
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