GROUP	=T2_G04

PROLOG=swipl

all:
	make -C server/feup-plog-tp1 PROLOG=$(PROLOG)

zip: LAIG_TP1_$(GROUP).zip LAIG_TP2_$(GROUP).zip LAIG_TP3_$(GROUP).zip

LAIG_TP1_$(GROUP).zip:
	zip -r LAIG_TP1_$(GROUP).zip TP1

LAIG_TP2_$(GROUP).zip:
	zip -r LAIG_TP2_$(GROUP).zip TP2

LAIG_TP3_$(GROUP).zip:
	zip -r LAIG_TP3_$(GROUP).zip TP3 lib

clean:
	rm -f *.zip
