% (C) 2020-2021 Diogo Rodrigues, Breno Pimentel
% Distributed under the terms of the GNU General Public License, version 3
% Inspired by the work of Luis Reis (ei12085@fe.up.pt) for LAIG course at FEUP.

% To use this server, start sicstus, load this file and call goal `server.`, using for instance
% `sicstus -l server.pl --goal "server."`.
%
% To test, issue a request using for instance curl:
%
% curl -d '{"command":["hello"]}' -H "Content-Type: application/json" -X POST "localhost:8081"
%
% and the server will cordially answer with `{"response":"hello"}`.
%
% To turn off the server, send command quit by calling
%
% curl -d '{"command":["quit"]}' -H "Content-Type: application/json" -X POST "localhost:8081"
%
% to which the server will answer with `{"response":"ok"}`.

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
	(Request = json([command=[quit]])), !.
	
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
handle_request(json(Members), json([response=Reply]), '200 OK') :-
	findall(Command, member(command=Command, Members), Commands),
	Commands = [Command|_],
	format('COMMAND:~n', []),
	write(Command),nl,
	handle_command(Command, Reply),
	format('DONE WITH COMMAND~n', []),
	!.
handle_request(_, '', '400 Bad Request').

% COMMANDS
handle_command([hello], hello).
handle_command([quit], ok).
