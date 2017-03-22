
fs = require 'fs'
HTMLLoader = require 'FileLoaderCheerio'
marked = require 'marked'

filePath = do ->
    name = process.argv.slice -1
    text = "../text/#{name}.txt"
    html = "../#{name}.html"
    template = 'template.html'
    return {text,html}

class TextLoader
    constructor: (path) ->
        @path = path
        @file = path.replace /^.*\//, ''
        @rawText = fs.readFileSync path, 'utf8'
        @parse()

    parse: ->
        tagsRegexp = /^#\S+$/gm
        @title = @rawText.match(/.+/)[0]
        @tags = @rawText.match(tagsRegexp).join(',').replace /#/g, ''
        @main = marked @rawText.replace tagsRegexp, ''

textLoader = new TextLoader filePath.text

try
    htmlLoader = new HTMLLoader filePath.html
catch err
    console.error err
    console.error 'no html file, read `template.html`. '
    useTemplate()
finally
    htmlLoader.update textLoader
    htmlLoader.sync()
    htmlLoader.write()

