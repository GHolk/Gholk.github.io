
text_to_html := system/text-to-html-page.coffee
text_files := $(wildcard text/*.txt)
html_files := $(patsubst text/%,./%,$(text_files))
html_files := $(html_files:.txt=.html)

.PHONY: all

all: $(html_files)

%.html: text/%.txt $(text_to_html)
	$(text_to_html) $< > $@

