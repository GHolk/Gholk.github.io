
text_to_html := ./text-to-html-page.coffee
generate_tags := ./generate_tags.sh
text_files := $(wildcard ../text/*.txt)
html_files := $(patsubst ../text/%,../%,$(text_files))
html_files := $(html_files:.txt=.html)


all: $(html_files) tags.txt upload

tags.txt: $(text_files)
	$(generate_tags) > $@

%.html: text/%.txt $(text_to_html)
	$(text_to_html) $< > $@
	xdg-open $@

upload: $(html_files) mirror-reverse.lftp
	lftp -f mirror-reverse.lftp

.PHONY: all upload
