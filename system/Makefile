
text_to_html := ./text-to-html-page.js
generate_tags := ./generate_tags.sh
list_file := ./list.txt
tags_file := ./tags.txt
text_files := $(wildcard ../text/*.txt)
html_files := $(patsubst ../text/%,../%,$(text_files))
html_files := $(html_files:.txt=.html)


all: $(html_files) $(tags_file) $(text_to_html) ../index.html

../index.html: $(html_files)
	cd .. && \
	index

%.js: %.coffee
	coffee -c $<
	sed -i '1i#!/usr/bin/env node' $@

$(tags_file): $(text_files)
	$(generate_tags) > $@

%.html: text/%.txt $(text_to_html)
	$(text_to_html) $< > $@
	if ! grep -q `basename $@` $(list_file) ; \
	then echo `basename $@` >>$(list_file) ; \
	fi

	xdg-open $@


upload: $(html_files) ../index.html $(tags_file)
	cd .. && \
	git add . && \
	git commit && \
	git push

.PHONY: all upload
