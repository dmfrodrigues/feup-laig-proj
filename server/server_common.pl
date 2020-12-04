% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(json([command=Command,args=Args]), json([response=Reply]), '200 OK') :-
	handle_command(Command, Args, Reply),
	!.
handle_request(_, '', '400 Bad Request').

% COMMANDS
:-reconsult('feup-plog-tp1/src/move.pl').
:-reconsult('feup-plog-tp1/src/choose_move.pl').
:-reconsult('feup-plog-tp1/src/value.pl').
:-reconsult('feup-plog-tp1/src/game_over.pl').

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
handle_command(
	value,
	json([gamestate=json([board=Board,turn=Turn]),turn=Turn]),
	Value
) :-
	value(gamestate(Board,Turn),Turn,Value).
handle_command(
	game_over,
	json([gamestate=json([board=Board,turn=Turn])]),
	json([isgameover=IsGameOver,winner=Winner])
) :-
	(game_over(gamestate(Board,Turn),W) ->
		(IsGameOver = 1, Winner = W);
		(IsGameOver = 0, Winner = 0)
	).
