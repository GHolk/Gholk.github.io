
#text_to_html := ./text-to-html-page.js
text_to_html := ./pager.sh
generate_tags := ./generate_tags.sh
list_file := ./list.txt
tags_file := ./tags.txt
text_files := $(wildcard ../text/*.txt)
html_files := $(patsubst ../text/%,../%,$(text_files))
html_files := $(html_files:.txt=.html)
coffee_files := $(wildcard *.coffee)
js_files := $(coffee_files:.coffee=.js)

all: $(js_files) $(html_files) $(tags_file) ../ext/*.js

%.js: %.coffee
	coffee -c $<

$(tags_file): $(text_files)
	$(generate_tags) > $@

%.html: text/%.txt
	if ! grep -q `basename $@` $(list_file) ; \
	then basename $@ >>$(list_file) ; \
	fi

	$(text_to_html) $@

	-xdg-open $@


upload: $(html_files) ../index.html $(tags_file)
	cd .. && \
	git add . && \
	git commit && \
	git push

.PHONY: all upload
