GROUP	=T2_G04

all: clean zip

zip: LAIG_TP1_$(GROUP).zip LAIG_TP2_$(GROUP).zip

LAIG_TP1_$(GROUP).zip:
	zip -r LAIG_TP1_$(GROUP).zip TP1

LAIG_TP2_$(GROUP).zip:
	zip -r LAIG_TP2_$(GROUP).zip TP2

clean:
	rm -f *.zip
