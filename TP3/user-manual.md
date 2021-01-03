---
title: |
    Glaisher: user manual\
    LAIG 2020/21 -- TP3
author: |
    Class 2, group 4\
    Breno Accioly de Barros Pimentel ([`up201800170@fe.up.pt`](mailto:up201800170@fe.up.pt))\
    Diogo Miguel Ferreira Rodrigues ([`up201806429@fe.up.pt`](mailto:up201806429@fe.up.pt))
date: 3rd of January, 2021
geometry: margin=2.5cm
fontsize: 12pt
output: pdf_document
---

## Setup instructions

No additional setup is required, as the Prolog server is remote. It uses the code available in [dmfrodrigues/feup-plog-tp1](https://github.com/dmfrodrigues/feup-plog-tp1). This code is also available in the compressed file, under directory `server`.

## Game rules

The game is played in an hexagonal board with side 5 hexes and longest diagonal 9 hexes. The game pieces are two-sided with sides coloured differently (one side red, one side yellow). A stack is a stack of pieces, and on each stack all pieces must have the same colour facing up. There are two players (player 1/red, player 2/yellow). A stack is owned by player 1 if the stack pieces have red facing up, or by player 2 if the stack pieces have yellow facing up.

Players take alternating turns in making moves, and a player can not skip his/her turn. A valid move is made of two actions:
1. Choose a stack of his/her colour, and split it into different-sized substacks (i.e., a 6-stack can be split into substacks [1,2,3] as they are different-sized, but not into [3,3] because two substacks have the same size); then, the player chooses a direction to move his/her substacks, and moves each substack in that direction, by as many cells as the substack is tall (i.e., if the substack has size/height 3, it will move 3 cells in the chosen direction).
2. Choose an empty cell to place a new piece.

A player wins if he/she connects two opposing sides of the board with stacks of his/her colour (cells in two sides belong to both sides), or if the opponent does not have any valid moves.

Similar information can be found in the main menu, by clicking the '?' button.

\pagebreak

## User instructions

The UI is straightforward.

The menu has options to define the type of game (Player vs Player, Player vs Computer or Computer vs Computer), the difficulty level of the autonomous player/computer (from 1 to 3), and the time each player is allowed in his/her turn (sandbox: no time limit; standard: 5min per turn; blitz: 1min per turn). At the bottom right corner there is a '?', which when clicked shows the game rules.

In the game, for the first action you click the stack to select it, and click the destination cells; on clicking 'Submit', the stack is divided into substacks and they are moved according to the rules. For the second action, just click on the cell the new piece should be placed, and it will be removed from the box.

To undo a turn, click the orange 'Undo' button. To cancel the move (go back to beginning of turn), click the red 'Cancel Move' button. To change theme, click the blue 'Change Theme' button.

In the case of the room scene, you can click the light switch to the right of the fireplace to turn the ceiling light off/on. There are no other light switches in any other scenes, as the lights would not make sense (in the case of the ISS and Alentejo scenes, the only light is the sun, and it does not make sense to turn the sun on/off).
