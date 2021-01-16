# GNU Make 3.8.2 and above

MAKEFLAGS += --no-print-directory
.PHONY: all start clean html css js assets

.EXPORT_ALL_VARIABLES:

PATH := $(PWD)/node_modules/.bin:$(PATH)
SHELL := /bin/bash

all: clean assets
	esbuild src/main.js --bundle --minify \
	--define:process.env.NODE_ENV=\"production\" \
	--loader:.js=jsx \
	--outfile=tmp/main.bundle.js
	tsc tmp/main.bundle.js --allowJs --lib DOM,ES2015 --target ES5 --outFile tmp/main.bundle.es5.js
	uglifyjs tmp/main.bundle.es5.js --toplevel -m -c drop_console=true,passes=3 > public/main.js
	sass src/style.scss public/style.css
	cleancss public/style.css -o public/style.css
	html-minifier --collapse-whitespace src/index.html -o public/index.html
	rm public/*.map

start: clean js css html assets
	node server --watch src,shared \
	--js "$(MAKE) js" \
	--scss "$(MAKE) css" \
	--html "$(MAKE) html"

clean:
	rm -rf public
	mkdir -p {tmp,src/assets,public/assets}

html:
	cp src/index.html public/index.html

css:
	sass src/style.scss public/style.css

js:
	esbuild src/main.js --bundle --sourcemap \
	--define:process.env.NODE_ENV=\"dev\" \
	--loader:.js=jsx \
	--outfile=public/main.js

assets:
	rm -rf public/assets
	cp -R src/assets public/assets
