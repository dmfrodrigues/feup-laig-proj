% (C) 2020-2021 Diogo Rodrigues, Breno Pimentel
% Distributed under the terms of the GNU General Public License, version 3
% Inspired by the work of Luis Reis (ei12085@fe.up.pt) for LAIG course at FEUP.

% To use this server, start sicstus, load this file and call goal `server.`, using for instance
%
% sicstus -l server.pl --goal "server."
%
% To test, issue a request using for instance curl:
%
% curl -d '{"command":"hello","args":{}}' -H "Content-Type: application/json" -X POST "localhost:8081"
%
% and the server will cordially answer with `{"response":"hello"}`.
%
% To turn off the server, send command quit by calling
%
% curl -d '{"command":"quit","args":{}}' -H "Content-Type: application/json" -X POST "localhost:8081"
%
% to which the server will answer with `{"response":"ok"}`.
%
% You can also try moving a piece in the board, by calling 
% 
% curl -d '{"command": "move", "args": { "board": [[  0,  6,  0,  0,  0,"nan","nan","nan","nan"],[  0,  0,  0,  0,  0, -6,"nan","nan","nan"],[  0,  0,  0,  0,  0,  0,  0,"nan","nan"],[ -6,  0,  0,  0,  0,  0,  0,  0,"nan"],[  0,  0,  0,  0,  0,  0,  0,  0,  0],["nan",  0,  0,  0,  0,  0,  0,  0,  6],["nan","nan",  0,  0,  0,  0,  0,  0,  0],["nan","nan","nan",  6,  0,  0,  0,  0,  0],["nan","nan","nan","nan",  0,  0,  0, -6,  0]], "playermove": { "player": 1, "pos": [0,1], "substacks": [1,2,3], "dir": 6, "newpos": [0,0]}}}' -H "Content-Type: application/json" -X POST "localhost:8081"
%
% to which the server will answer with the new game board.
%
% To call the autonomous player:
%
% curl -d '{"command": "choose_move", "args": { "gamestate": { "board": [[  0,  6,  0,  0,  0,"nan","nan","nan","nan"],[  0,  0,  0,  0,  0, -6,"nan","nan","nan"],[  0,  0,  0,  0,  0,  0,  0,"nan","nan"],[ -6,  0,  0,  0,  0,  0,  0,  0,"nan"],[  0,  0,  0,  0,  0,  0,  0,  0,  0],["nan",  0,  0,  0,  0,  0,  0,  0,  6],["nan","nan",  0,  0,  0,  0,  0,  0,  0],["nan","nan","nan",  6,  0,  0,  0,  0,  0],["nan","nan","nan","nan",  0,  0,  0, -6,  0]], "turn": 1 }, "turn": 1, "level": 3, "n": 7}}' -H "Content-Type: application/json" -X POST "localhost:8081"
%
% To get a board value:
%
% curl -d '{"command": "value", "args": { "gamestate": { "board": [[  0,  6,  0,  0,  0,"nan","nan","nan","nan"],[  0,  0,  0,  0,  0, -6,"nan","nan","nan"],[  0,  0,  0,  0,  0,  0,  0,"nan","nan"],[ -6,  0,  0,  0,  0,  0,  0,  0,"nan"],[  0,  0,  0,  0,  0,  0,  0,  0,  0],["nan",  0,  0,  0,  0,  0,  0,  0,  6],["nan","nan",  0,  0,  0,  0,  0,  0,  0],["nan","nan","nan",  6,  0,  0,  0,  0,  0],["nan","nan","nan","nan",  0,  0,  0, -6,  0]], "turn": 1 }, "turn": 1}}' -H "Content-Type: application/json" -X POST "localhost:8081"
%
% To check if the game is over:
%
% curl -d '{"command": "game_over", "args": { "gamestate": { "board": [[  0,  6,  0,  0,  0,"nan","nan","nan","nan"],[  0,  0,  0,  0,  0, -6,"nan","nan","nan"],[  0,  0,  0,  0,  0,  0,  0,"nan","nan"],[ -6,  0,  0,  0,  0,  0,  0,  0,"nan"],[  0,  0,  0,  0,  0,  0,  0,  0,  0],["nan",  0,  0,  0,  0,  0,  0,  0,  6],["nan","nan",  0,  0,  0,  0,  0,  0,  0],["nan","nan","nan",  6,  0,  0,  0,  0,  0],["nan","nan","nan","nan",  0,  0,  0, -6,  0]],"turn":1}}}' -H "Content-Type: application/json" -X POST "localhost:8081"
% 
% or also
%
% curl -d '{"command": "game_over", "args": { "gamestate": { "board": [ [ -1,  0, -1,  0,  1,"nan","nan","nan","nan"],[  0,  0, -1,  0,  0,  0,"nan","nan","nan"],[  0,  0,  0, -6,  0,  3,  1,"nan","nan"],[  0,  0,  2,  3,  5,  1,  0,  0,"nan"],[  1,  2,  1,  0, -3,  0,  0,  0,  0],["nan",  0, -3, -1, -3,  0,  0,  0,  0],["nan","nan",  0, -1,  0,  2,  0,  0,  0],["nan","nan","nan", -1,  0,  0,  0,  1,  0],["nan","nan","nan","nan",  0,  0,  0,  0,  0]],"turn":1}}}' -H "Content-Type: application/json" -X POST "localhost:8081"

:-
	(current_prolog_flag(dialect, sicstus), reconsult('server_sicstus.pl'));
	(current_prolog_flag(dialect, swi    ), reconsult('server_swi.pl')).
