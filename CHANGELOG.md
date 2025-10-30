## version 1.3.2 - 2025-10-30
- Updated game rules to explain question marks

## version 1.3.1 - 2025-10-30
- Bugfix: 3x3x1 boards were not solvable due to being entirely taken by the forbidden zone
- Added a navigation link from the game page to the creator page
- Implemented SteamGifts visual identity
- Implemented a question mark cycling for cells you're unsure about

## version 1.3.0 - 2025-10-30
- Implemented left-click chording logic
    - Chording allow users to reveal cells around a numbered cell by flagging all surrounding mines
    - Chording with a misplaced flag will detonate a mine
- Updated game rules to explain chording
- Visual change to reduce gap between cells
- Added reactive styles to the game board
- Added resizing functionality for mobile device orientation change

## version 1.2.0 - 2025-10-29
- Implemented localStorage strategy to track solved puzzles and display them on the game page
    - localStorage helper functions on `utils.js`
    - Marking as solved, checking if solved (`game-ui.js`)
- Added a "Replay" button to the game page, which clears localStorage
    - Including associated styles
- Options to enable and disable the game board
- General formatting and readibility improvements
- Misc style improvements

## version 1.1.0 - 2025-10-28
- Added a solver module, which can be used to check if a given game configuration is solvable without guessing
- Integrated the solver into the placeMines routine to ensure created games are solvable
    - This includes defining a safe (forbidden) zone around the first click, placing the mines as before (except in and around the safe zone), calculating each cell's number, and checking if the game is solvable
    - If a game is not solvable with the current solver implementation, warn the user
- Added several game parameter validations on the creator page
    - This include input validation for the number of mines in a custom game
    - As well as comparing the number of mines with the number of cells + the forbidden zone (zone around the initial click that is empty, important for the solver to work properly)
- Added alert messages for high-mine density configurations
    - Also important for the solver, as it's efficacy drops very quickly as the mine density increases
- Improved documentation

## version 1.0.3 - 2025-10-27
- Hotfix for very large boards overflowing the parent container

## version 1.0.2 - 2025-10-27
- Implemented custom difficulty selector and removed "Test" difficulty option
- Code readability cleanup

## version 1.0.1 - 2025-10-25
- Updated game logic so game ends when all non-mine cells are revealed
    - This removes the need to flag all mines to win. The effect is practically the same, but it can be less confusing for new players
- Updated link generation logic to be shorter and URL safe
    - This was a major update. Instead of sending the data in a JSON, the encoder now uses a simple array based format, which saves a lot of data
    - We also changed the encryption method to use XOR instead of AES. It's not as secure, but lighter and removes a dependency on external libraries
    - The base64 encoding was also made URL safe by replacing invalid characters
- Updated footer wording and style
- General wording adjustments
- Added game rules container
- General formatting and readibility improvements
- Fixed container sizes to prevent different sizes based on content

## version 1.0.0 - 2025-10-24
- Public release
- Added footer
- Incorporated cell resizing logic for larger boards

## version 0.9.2 - 2025-10-24
- Adjusted button style to properly hide the "Restart" button

## version 0.9.1 - 2025-10-24
- Updated initGameUI logic to hide the "Restart" button (previously visible when it shouldn't)

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