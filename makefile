GROUP	=T2_G04

PROLOG=sicstus

all:
	make -C server/feup-plog-tp1 PROLOG=$(PROLOG)

test:
	cd server && sicstus -l server.pl --goal "server." -- parallel &
	sleep 2
	curl -d '{"command":"hello","args":{}}' -H "Content-Type: application/json" -X POST "localhost:8081"
	curl -d '{"command": "move", "args": { "board": [[  0,  6,  0,  0,  0,"nan","nan","nan","nan"],[  0,  0,  0,  0,  0, -6,"nan","nan","nan"],[  0,  0,  0,  0,  0,  0,  0,"nan","nan"],[ -6,  0,  0,  0,  0,  0,  0,  0,"nan"],[  0,  0,  0,  0,  0,  0,  0,  0,  0],["nan",  0,  0,  0,  0,  0,  0,  0,  6],["nan","nan",  0,  0,  0,  0,  0,  0,  0],["nan","nan","nan",  6,  0,  0,  0,  0,  0],["nan","nan","nan","nan",  0,  0,  0, -6,  0]], "playermove": { "player": 1, "pos": [0,1], "substacks": [1,2,3], "dir": 6, "newpos": [0,0]}}}' -H "Content-Type: application/json" -X POST "localhost:8081"
	curl -d '{"command": "choose_move", "args": { "gamestate": { "board": [[  0,  6,  0,  0,  0,"nan","nan","nan","nan"],[  0,  0,  0,  0,  0, -6,"nan","nan","nan"],[  0,  0,  0,  0,  0,  0,  0,"nan","nan"],[ -6,  0,  0,  0,  0,  0,  0,  0,"nan"],[  0,  0,  0,  0,  0,  0,  0,  0,  0],["nan",  0,  0,  0,  0,  0,  0,  0,  6],["nan","nan",  0,  0,  0,  0,  0,  0,  0],["nan","nan","nan",  6,  0,  0,  0,  0,  0],["nan","nan","nan","nan",  0,  0,  0, -6,  0]], "turn": 1 }, "turn": 1, "level": 3, "n": 7}}' -H "Content-Type: application/json" -X POST "localhost:8081"
	kill $(ps a | grep "sicstus" | grep -v "grep" | awk '{print $1;}')

zip: LAIG_TP1_$(GROUP).zip LAIG_TP2_$(GROUP).zip

LAIG_TP1_$(GROUP).zip:
	zip -r LAIG_TP1_$(GROUP).zip TP1

LAIG_TP2_$(GROUP).zip:
	zip -r LAIG_TP2_$(GROUP).zip TP2

clean:
	rm -f *.zip
