:-use_module(library(sockets)).
:-use_module(library(lists)).
:-use_module(library(codesio)).
:-use_module(library(json)).

port(8081).

% Server Entry Point
server :-
	port(Port),
	socket_server_open(Port, Socket),
	repeat,
		socket_server_accept(Socket, _Client, Stream, [type(text)]),
		
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
		format('Request: ~q~n',[Request]),
		handle_request(Request, Response, Status),
		format('Reply: ~q~n', [Response]),
		format('Status: ~q~n~n', [Status]),
		
		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: application/json~n~n', []),
		json_write(Stream, Response, [width(60)]),

		close_stream(Stream),
	% (Request = json([command=quit,args=json([])])),
	fail,
	!.
	
close_stream(Stream) :-
	flush_output(Stream),
	close(Stream).

read_header(Stream) :-
	repeat,
		read_line(Stream, Line),
	Line = [],
	!.

read_request(Stream, Request) :-
	json_read(Stream, Request),
	write(Request),nl.

:-
	reconsult('server_common.pl').

:-
	server.
