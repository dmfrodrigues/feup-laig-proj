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
	rm -rf LAIG_TP3_$(GROUP)
	mkdir -p LAIG_TP3_$(GROUP)
	cd TP3 && pandoc user-manual.md -o user-manual.pdf
	cp -r TP3 lib server LAIG_TP3_$(GROUP)
	rm -rf LAIG_TP3_$(GROUP)/server/feup-plog-tp1/.git
	rm -rf LAIG_TP3_$(GROUP)/server/feup-plog-tp1/img
	cd LAIG_TP3_$(GROUP) && zip -r ../LAIG_TP3_$(GROUP).zip .
	# rm -rf LAIG_TP3_$(GROUP)

clean:
	git clean -dfX
