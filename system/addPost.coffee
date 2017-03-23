
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

createTemplateLoader = ->
    templateLoader = new HTMLLoader 'template.html'

    updateRel = (prevPath, nextFile) ->
        prevLoader = new HTMLLoader "../#{prevPath}"
        prevLoader.next = nextFile
        prevLoader.sync()
        prevLoader.write()
    updateRel templateLoader.prev, filePath.html

    updateTemplateLoader = (templateLoader, nextFile) ->
        oldPrev = templateLoader.prev
        templateLoader.prev = nextFile
        templateLoader.sync()
        templateLoader.write()
        templateLoader.prev = oldPrev
    updateTemplateLoader templateLoader, filePath.html

    temp = filePath.html.replace '^.*/', ''
    [templateLoader.prev, temp] = [temp, templateLoader.prev]
    templateLoader.sync()
    templateLoader.write()

    [templateLoader.prev, temp] = [temp, templateLoader.prev]
    templateLoader.path = filePath.html

    templateLoader.update = (newLoader) ->
        HTMLLoader.prototype.update.call this, newLoader
        @date = (new Date()).toISOString()

    templateLoader.sync = ->
        HTMLLoader.prototype.sync.call this
        updateRel()

    return templateLoader


try
    htmlLoader = new HTMLLoader filePath.html
catch err
    console.error err
    console.error 'no html file, read `template.html`. '
    htmlLoader = createTemplateLoader()
finally
    htmlLoader.update textLoader
    htmlLoader.sync()
    htmlLoader.write()

