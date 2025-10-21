// Game configuration
const configs = {
  test: { rows: 3, cols: 3, mines: 1 },
  easy: { rows: 8, cols: 8, mines: 10 },
  medium: { rows: 12, cols: 12, mines: 20 },
  hard: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 30, cols: 16, mines: 99 },
  // custom: { rows: 0, cols: 0, mines: 0 },
};

// Game state
let board = [];
let revealed = [];
let flagged = [];
let gameOver = false;
let gameWon = false;
let mineCount = 0;
let timer = 0;
let timerInterval = null;
let firstClick = true;

// Hidden content (you'll replace this with actual giveaway link)
const hiddenLink = "https://www.steamgifts.com/giveaway/XXXXX/game-name";

// DOM elements
const gameBoard = document.getElementById("game-board");
const flagCountEl = document.getElementById("flag-count");
const mineCountEl = document.getElementById("mine-count");
const timerEl = document.getElementById("timer");
const messageEl = document.getElementById("message");
const hiddenContentEl = document.getElementById("hidden-content");
const giveawayLinkEl = document.getElementById("giveaway-link");
const newGameBtn = document.getElementById("new-game");
const difficultySelect = document.getElementById("difficulty");

// Initialize game
function initGame() {
  const difficulty = difficultySelect.value;
  const config = configs[difficulty];

  board = [];
  revealed = [];
  flagged = [];
  gameOver = false;
  gameWon = false;
  firstClick = true;
  timer = 0;
  mineCount = config.mines;

  clearInterval(timerInterval);
  timerEl.textContent = "0";
  messageEl.textContent = "";
  messageEl.className = "message";
  hiddenContentEl.classList.remove("visible");

  // Create empty board
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

  renderBoard(config);
  updateFlagCount();
}

// Place mines (called after first click to avoid hitting mine immediately)
function placeMines(config, excludeRow, excludeCol) {
  let minesPlaced = 0;
  while (minesPlaced < config.mines) {
    const row = Math.floor(Math.random() * config.rows);
    const col = Math.floor(Math.random() * config.cols);

    // Don't place mine on first click or where mine already exists
    if ((row === excludeRow && col === excludeCol) || board[row][col] === -1) {
      continue;
    }

    board[row][col] = -1; // -1 represents a mine
    minesPlaced++;
  }

  // Calculate numbers for each cell
  for (let i = 0; i < config.rows; i++) {
    for (let j = 0; j < config.cols; j++) {
      if (board[i][j] !== -1) {
        board[i][j] = countAdjacentMines(i, j, config);
      }
    }
  }
}

// Count adjacent mines
function countAdjacentMines(row, col, config) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;
      if (
        newRow >= 0 &&
        newRow < config.rows &&
        newCol >= 0 &&
        newCol < config.cols &&
        board[newRow][newCol] === -1
      ) {
        count++;
      }
    }
  }
  return count;
}

// Render the game board
function renderBoard(config) {
  gameBoard.innerHTML = "";
  gameBoard.style.gridTemplateColumns = `repeat(${config.cols}, 40px)`;
  mineCountEl.textContent = config.mines;

  for (let i = 0; i < config.rows; i++) {
    for (let j = 0; j < config.cols; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = i;
      cell.dataset.col = j;

      cell.addEventListener("click", () => handleCellClick(i, j));
      cell.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        handleRightClick(i, j);
      });

      gameBoard.appendChild(cell);
    }
  }
}

// Handle cell click
function handleCellClick(row, col) {
  if (gameOver || revealed[row][col] || flagged[row][col]) return;

  // Place mines after first click
  if (firstClick) {
    const config = configs[difficultySelect.value];
    placeMines(config, row, col);
    firstClick = false;
    startTimer();
  }

  revealCell(row, col);
  checkWin();
}

// Reveal a cell
function revealCell(row, col) {
  if (revealed[row][col] || flagged[row][col]) return;

  revealed[row][col] = true;
  const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  cell.classList.add("revealed");

  if (board[row][col] === -1) {
    // Hit a mine
    cell.textContent = "💣";
    cell.classList.add("mine");
    endGame(false);
  } else if (board[row][col] > 0) {
    // Show number
    cell.textContent = board[row][col];
    cell.classList.add(`number-${board[row][col]}`);
  } else {
    // Empty cell - reveal adjacent cells
    const config = configs[difficultySelect.value];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i;
        const newCol = col + j;
        if (
          newRow >= 0 &&
          newRow < config.rows &&
          newCol >= 0 &&
          newCol < config.cols
        ) {
          revealCell(newRow, newCol);
        }
      }
    }
  }
}

// Handle right click (flag)
function handleRightClick(row, col) {
  if (gameOver || revealed[row][col]) return;

  flagged[row][col] = !flagged[row][col];
  const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);

  if (flagged[row][col]) {
    cell.classList.add("flagged");
    cell.textContent = "🚩";
  } else {
    cell.classList.remove("flagged");
    cell.textContent = "";
  }

  updateFlagCount();
}

// Update flag count
function updateFlagCount() {
  let count = 0;
  flagged.forEach((row) => row.forEach((f) => (count += f ? 1 : 0)));
  flagCountEl.textContent = count;
}

// Check if player won
function checkWin() {
  const config = configs[difficultySelect.value];
  let revealedCount = 0;

  for (let i = 0; i < config.rows; i++) {
    for (let j = 0; j < config.cols; j++) {
      if (revealed[i][j]) revealedCount++;
    }
  }

  const totalCells = config.rows * config.cols;
  if (revealedCount === totalCells - config.mines) {
    endGame(true);
  }
}

// End game
function endGame(won) {
  gameOver = true;
  gameWon = won;
  clearInterval(timerInterval);

  if (won) {
    messageEl.textContent = "🎉 You won! Congratulations!";
    messageEl.className = "message win";
    hiddenContentEl.classList.add("visible");
    giveawayLinkEl.href = hiddenLink;
  } else {
    messageEl.textContent = "💥 Game Over! You hit a mine.";
    messageEl.className = "message lose";
    revealAllMines();
  }
}

// Reveal all mines when game is lost
function revealAllMines() {
  const config = configs[difficultySelect.value];
  for (let i = 0; i < config.rows; i++) {
    for (let j = 0; j < config.cols; j++) {
      if (board[i][j] === -1) {
        const cell = document.querySelector(
          `[data-row="${i}"][data-col="${j}"]`
        );
        cell.classList.add("revealed", "mine");
        cell.textContent = "💣";
      }
    }
  }
}

// Timer functions
function startTimer() {
  timerInterval = setInterval(() => {
    timer++;
    timerEl.textContent = timer;
  }, 1000);
}

// Event listeners
newGameBtn.addEventListener("click", initGame);
difficultySelect.addEventListener("change", initGame);

// Start the game
initGame();