## version 0.9.0 - 2025-10-24
- Refactored base64 encoding to use `arrayBufferToBase64` instead of `fromCharCode` and spread operator
    - The previous approach could fail for binary data because String.fromCharCode doesn't handle values greater than 255 correctly, and the spread operator with large arrays can cause issues
    - The key change is the new arrayBufferToBase64 helper function that properly converts the compressed Uint8Array to a base64 string without using the spread operator
    - That prevents backward compatibility with older links, but since this version is not public yet this shouldn't be a problem
- Added a button to restart the game when a mine is hit
- Removed unused functions

## version 0.2.1 - 2025-10-23
- Improved secret encryption in utils.js
    - Now it won't show as plain text in the URL, which could be easily decoded, but instead, as a scrambled string
    - Anyone with access to the code can easily decrypt it since the decryption key is public, but at least it will slow down less capable actors
- Removed Base58 dependency for encoding and decoding
- Added 'pako' for deflating and inflating data
- Reworked encoding and decoding logic to use pako and generate a shorter link

## version 0.1.4 - 2025-10-23
- Updated documentation for `utils.js`
- Removed unused imports from `creator.js`
- Updated wording for alert in `creator.js` when no secret is provided
- Updated wording for `game-ui.js` win screen
- QoL improvements in `creator.js` including auto-selecting generated link, removing unnecessary alert and updating button text when copying is successful
- Updated styles to reduce font size on long input boxes
- Updated the game page to show the link directly after beating the game instead of requiring a button click / anchor element

## version 0.1.3 - 2025-10-23
- Adjusted the generated link (previous version missed the /sg-minesweeper/ prefix)

## version 0.1.2 - 2025-10-22
- Writing improvements, general look and feel
- Tree-shaking and module bundling, removing some leftover modules from the refactoring
- Reworked encoding and decoding logic to Base58 (from Base64) -- assumption is that Base64 hash was messing Github Pages URL

## version 0.1.1 - 2025-10-22
- Removed unnecessary controls from the game page, such as difficulty select and New Game button
- Fixed a bug where the first click was not recognized as a valid move
    - This led to an "Uncaught TypeError: "firstClick" is read-only". This happens because firstClick was defined in `game-logic.js`, exported from `game-logic.js`, and imported into `game-ui.js`. Then `game-ui.js` tried to modify firstClick, which is not allowed.
    - The fix was to keep firstClick as a locally scoped variable in `game-ui.js`, but not export it directly, instead accessing and modifying its value through function calls
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