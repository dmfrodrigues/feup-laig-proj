:- use_module(library(http/http_server)).
:- use_module(library(lists)).
:- use_module(library(codesio)).
:- use_module(library(http/http_json)).
:- use_module(library(http/json)).

:- http_handler(root(.), server, [method(post)]).

server(Request) :-
    http_read_json(Request, JSON),
    handle_request(JSON, Response, Status),
    format(current_output, 'Status: ~s~n', [Status]),
    format(current_output, 'Access-Control-Allow-Origin: *~n', []),
    format(current_output, 'Content-Type: application/json~n~n', []),
    json_write(current_output, Response, [width(60)]).

:-
	reconsult('server_common.pl').

:- 
    http_server([port(8081)]).

:-
    thread_get_message(_).
