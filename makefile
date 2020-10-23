GROUP	=T2_G04

all: clean zip

zip: LAIG_TP1_$(GROUP).zip

LAIG_TP1_$(GROUP).zip:
	zip -r LAIG_TP1_$(GROUP).zip TP1

clean:
	rm -f *.zip
