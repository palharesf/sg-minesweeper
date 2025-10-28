// Minesweeper solver - checks if a board is solvable without guessing

/**
 * Main solver function: checks if a board can be solved using only logic
 * @param {number[][]} board - The mine board (-1 for mines, 0-8 for numbers)
 * @param {number} rows - Number of rows
 * @param {number} cols - Number of columns
 * @param {number} startRow - Starting row position
 * @param {number} startCol - Starting column position
 * @returns {boolean} - True if solvable without guessing
 */

export function isSolvable(board, rows, cols, startRow, startCol) {
  // Create a knowledge grid (-2 = unknown, -1 = flagged mine, 0-8 = number)
  const knowledge = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(-2));

  // Open the starting square
  openSquareForSolver(board, knowledge, rows, cols, startRow, startCol);

  // Iteratively make deductions
  let madeProgress = true;
  let iterations = 0;
  const maxIterations = 1000;

  while (madeProgress && iterations < maxIterations) {
    madeProgress = false;
    iterations++;

    // Try simple deductions on each revealed square
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (knowledge[row][col] >= 0) {
          const deductions = analyzeSquare(knowledge, rows, cols, row, col);

          if (deductions.mines.length > 0 || deductions.safe.length > 0) {
            madeProgress = true;

            // Mark mines
            deductions.mines.forEach(([r, c]) => {
              knowledge[r][c] = -1;
            });

            // Open safe squares
            deductions.safe.forEach(([r, c]) => {
              openSquareForSolver(board, knowledge, rows, cols, r, c);
            });
          }
        }
      }
    }
  }

  // Check if completely solved
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (knowledge[row][col] === -2) {
        return false; // Still have unknown squares
      }
    }
  }

  return true;
}

/**
 * Analyze a numbered square to find definite mines or safe squares
 * Uses constraint satisfaction: if mines_left equals unknown squares, they're all mines
 */
function analyzeSquare(knowledge, rows, cols, row, col) {
  const number = knowledge[row][col];
  if (number < 0) return { mines: [], safe: [] };

  const neighbors = getNeighbors(rows, cols, row, col);
  const unknown = neighbors.filter(([r, c]) => knowledge[r][c] === -2);
  const flagged = neighbors.filter(([r, c]) => knowledge[r][c] === -1);

  const minesLeft = number - flagged.length;

  const mines = [];
  const safe = [];

  // If remaining mines equals unknown squares, they're all mines
  if (minesLeft > 0 && unknown.length === minesLeft) {
    mines.push(...unknown);
  }

  // If we've found all mines, remaining squares are safe
  if (minesLeft === 0 && unknown.length > 0) {
    safe.push(...unknown);
  }

  return { mines, safe };
}

/**
 * Open a square in the solver's knowledge grid
 * If it's a zero, cascade to all neighbors
 */
function openSquareForSolver(board, knowledge, rows, cols, row, col) {
  if (row < 0 || row >= rows || col < 0 || col >= cols) {
    return;
  }
  if (knowledge[row][col] !== -2) return; // Already known

  const value = board[row][col];

  // Don't reveal mines in solver (this would indicate an error)
  if (value === -1) {
    console.error("Solver tried to open a mine at", row, col);
    return;
  }

  knowledge[row][col] = value;

  // If it's a zero, cascade to neighbors
  if (value === 0) {
    const neighbors = getNeighbors(rows, cols, row, col);
    neighbors.forEach(([r, c]) => {
      openSquareForSolver(board, knowledge, rows, cols, r, c);
    });
  }
}

/**
 * Get all valid neighbors of a square
 * @returns {Array<[number, number]>} Array of [row, col] pairs
 */
function getNeighbors(rows, cols, row, col) {
  const neighbors = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const newRow = row + i;
      const newCol = col + j;
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        neighbors.push([newRow, newCol]);
      }
    }
  }
  return neighbors;
}
