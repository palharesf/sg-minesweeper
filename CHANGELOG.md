## version 0.1.2 - 2025-10-22
- Writing improvements, general look and feel
- Tree-shaking and module bundling, removing some leftover modules from the refactoring
- Reworked encoding and decoding logic to Base58 (from Base64) -- assumption is that Base64 hash was messing Github Pages URL

## version 0.1.1 - 2025-10-22
- Removed unnecessary controls from the game page, such as difficulty select and New Game button
- Fixed a bug where the first click was not recognized as a valid move
-- This led to an "Uncaught TypeError: "firstClick" is read-only". This happens because firstClick was defined in game-logic.js, exported from game-logic.js, and imported into game-ui.js. Then game-ui.js tried to modify firstClick, which is not allowed.
-- The fix was to keep firstClick as a locally scoped variable in game-ui.js, but not export it directly, instead accessing and modifying its value through function calls
- Fixed a missing difficulty configuration after refactor (test difficulty)

## version 0.1.0 - 2025-10-22
- Refactored `game.js` into modular components: `utils.js`, `game-logic.js`, `game-ui.js`, `creator.js`, and `game-init.js`
- Renamed `index.html` to `game.html` (player page) and created a new `index.html` (creator page).
- Creator page allows users to select difficulty, provide a reward URL, and generate a shareable game link.
- Player page parses game configuration from the URL, renders the Minesweeper game, and reveals the reward upon winning.
- Added `type="module"` to script tags for ES6 module support
- Updated `style.css` to include styles for both creator and player pages.

## version 0.0.3 - 2025-10-21
- Adjusted CSS to prevent background from overextending in the case of very small grids

## version 0.0.2 - 2025-10-21
- Added new difficulty options (test and expert)
- Ensure game is only won if both victory conditions are met (all non-mine cells revealed and all mines flagged)
- Add victory check when planting flags (not only when revealing cells)
- General improvements in code readability and writing

## version 0.0.1 - 2025-10-20
- Initial release