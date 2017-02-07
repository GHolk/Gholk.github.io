
text_to_html := ./text-to-html-page.js
generate_tags := ./generate_tags.sh
text_files := $(wildcard ../text/*.txt)
html_files := $(patsubst ../text/%,../%,$(text_files))
html_files := $(html_files:.txt=.html)


all: $(html_files) tags.txt $(text_to_html) ../index.html upload

../index.html: $(html_files)
	cd .. ; \
	index

%.js: %.coffee
	coffee -c $<
	sed -i '1i#!/usr/bin/env node' $@

tags.txt: $(text_files)
	$(generate_tags) > $@

%.html: text/%.txt $(text_to_html)
	$(text_to_html) $< > $@
	xdg-open $@

upload: $(html_files) ../index.html tags.txt
	cd .. ; \
	git add . ; \
	git commit ; \
	git push

.PHONY: all upload
