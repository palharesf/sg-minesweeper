# sg-minesweeper

## What is it?

sg-minesweeper is a small project I decided to develop as a personal challenge and learning opportunity, as well as another fun way to hide giveaway links and codes. It is built by a SG community member, to the SG community, and hence, it's features are meant to make sense to that community, not necessarily to the general public

## How to use it

When you land on the main page, you'll be prompted with a difficulty toggle, a secret input box, and a "Generate" button.
After choosing the difficulty and entering the secret you want to hide, you click the "Generate" button and a link will be generated containing your difficulty parameters and your encoded secret.

The link will bring you to the game page.
To win the game, you need to achieve two conditions: every non-mine square must be revealed, and every mine must be flagged.
To reveal a cell, just left-click (or tap on mobile); to flag a cell, right-click (or long-press on mobile).
If you hit a mine, you have to refresh the page.

Once you've won the game, you'll be able to see the secret that the game's creator hid.

## How long does it take to solve the game?

I tested the two easiest difficulty options a lot. "Test" difficulty hardly takes more than 1 second to solve, while "Easy" difficulty usually takes around 100 seconds (1m40s) to solve on average.

[Claude](https://claude.ai/chat/73ea4433-47a1-482f-954b-de4762c8de26) estimates that, based on those figures, "Medium" should take 3-5 minutes, "Hard" goes on to 8-12 minutes, and "Expert" should range from 25-40 minutes.

Think about it if you're feeling spicy and want to screw your fellow SG friends.

## Can I play on my phone?

It worked on mine. Short-press for opening cells, long-press to set flags, it should be fine.
I haven't tried to create a giveaway through my phone, but I don't see why it wouldn't work

## What kind of secrets can I hide?

Anything that can be encoded as a string (and compressed with pako).
Be sensible, don't try to hide a novel. My testing was limited to giveaway links, five-char codes, and 15-char Steam keys. I didn't stress-test this part of the code, but if you want to do it, be my guest

## So I heard it's impossible to decrypt my secret that I hid with sg-minesweeper, right?

Wrong. It's not. If you're tech-savvy you can reverse-engineer the secret based on the URL. The point of this project is not to offer a fool-proof way to share secrets (there's [OneTimeSecret](https://onetimesecret.com/en/) for instance), but rather to give a fun way to hide them.

## I found a bug / I have an idea / I have a suggestion

That's terrible (if it's a bug) or wonderful (if it's a suggestion). You can [open an issue](https://github.com/sg-minesweeper/sg-minesweeper/issues) on GitHub and we'll take it from there

## Who deserves credit here?
I would be remiss if I didn't mention a few specific SG members:

- [Carlo](https://www.steamgifts.com/user/Carlo) - For the original idea. It was their suggestion that sparked the bulb in my head and moved me to action
- [RosimInc](https://www.steamgifts.com/user/rosiminc) - For the SG nono project. Not only I had incredible fun playing it over and over and over, but their project served as the template for mine, both in terms of code as well as deployment
- [yannbz](https://www.steamgifts.com/user/yannbz) - Similar to RosimInc, but with the Wordle game. Except that I hate Wordle and played their project once hahaha but jokes aside, the project has been quite successful and popular with a segment of the SG community, and I can appreciate and respect that as well
- [Grogglz](https://www.steamgifts.com/user/Grogglz) - For creating a kind thread that eventually led to Carlo's comment that sparked the whole thing. Without your fun challenge there would be no minesweeper
- [Carlo](https://www.steamgifts.com/user/Carlo), [BEAUREGARDE](https://www.steamgifts.com/user/BEAUREGARDE), [Vini1](https://www.steamgifts.com/user/Vini1) and [adam1224](https://www.steamgifts.com/user/adam1224) - For the playtesting support

## You are the best and I want to support you, how can I do that?

Feel free to contribute to the code on [GitHub](https://github.com/sg-minesweeper/sg-minesweeper).
I also take [coffee](https://ko-fi.com/fernandopa), or you can gift me a game from my [Steam Wishlist](https://store.steampowered.com/wishlist/id/fernandopaa/) if you're into that kind of thing

## Documentation

- [Changelog](CHANGELOG.md) - Version history
- [Roadmap](ROADMAP.md) - Planned features
