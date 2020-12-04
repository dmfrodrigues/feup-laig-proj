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

:-use_module(library(sockets)).
:-use_module(library(lists)).
:-use_module(library(codesio)).
:-use_module(library(json)).

port(8081).

% Server Entry Point
server :-
	port(Port),
	write('Opened Server'),nl,nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl,
	halt.

% Server Loop 
% Uncomment writes for more information on incomming connections
server_loop(Socket) :-
	repeat,
		socket_server_accept(Socket, _Client, Stream, [type(text)]),
		write('Accepted connection'), nl,
	    
		% Parse Request
		catch((
			read_header(Stream),
			read_request(Stream, Request)
		),_Exception,(
			write('Error parsing request.'),nl,
			close_stream(Stream),
			fail
		)),
		
		% Generate Response
		handle_request(Request, MyReply, Status),
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),
		format('Status: ~q~n', [Status]),
		
		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: application/json~n~n', []),
		json_write(Stream, MyReply, [width(10)]),

		write('Finished Connection'),nl,nl,
		close_stream(Stream),
	% (Request = json([command=quit,args=json([])])),
	fail,
	!.
	
close_stream(Stream) :-
	flush_output(Stream),
	close(Stream).

read_header(Stream) :-
	format('HEADER:~n', []),
	repeat,
		read_line(Stream, Line),
		format('~s~n', [Line]),
	Line = [], !.

read_request(Stream, Request) :-
	format('REQUEST:~n', []),
	json_read(Stream, Request),
	write(Request),nl.

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(json([command=Command,args=Args]), json([response=Reply]), '200 OK') :-
	format('COMMAND:~n', []),
	write(Command),nl,
	format('ARGS:~n', []),
	write(Args),nl,
	handle_command(Command, Args, Reply),
	format('DONE WITH COMMAND~n', []),
	!.
handle_request(Command, '', '400 Bad Request') :-
	format('Refused command "~q"~n', [Command]).

% COMMANDS
:-reconsult('feup-plog-tp1/src/move.pl').
:-reconsult('feup-plog-tp1/src/choose_move.pl').

:-
	retract(base_directory(_)),
	current_working_directory(CWD),
	atom_concat(CWD, 'feup-plog-tp1/', BASE),
	assert(base_directory(BASE)).

handle_command(hello, json([]), hello).
% handle_command(quit, json([]), ok).
handle_command(
	move,
	json([board=Board, playermove=json([player=Player,pos=[PosI,PosJ],substacks=Substacks,dir=Dir,newpos=[NewPosI,NewPosJ]])]),
	NewBoard
) :-
	Move = playermove(Player, PosI-PosJ, Substacks, Dir, NewPosI-NewPosJ),
	move(Board, Move, NewBoard).
handle_command(
	choose_move,
	json([gamestate=json([board=Board,turn=Turn]),turn=Turn,level=Level,n=N]),
	json([player=Player,pos=[PosI,PosJ],substacks=Substacks,dir=Dir,newpos=[NewPosI,NewPosJ]])
) :-
	GameState = gamestate(Board, Turn),
	Move = playermove(Player,PosI-PosJ,Substacks,Dir,NewPosI-NewPosJ),
	choose_move(GameState, Turn, Level, N, Move). 
