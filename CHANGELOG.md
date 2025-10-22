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