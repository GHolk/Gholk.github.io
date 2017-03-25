
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

maintainTemplate = (templateLoader, thisFile, thisTitle) ->
    updateRel = (prevPath, thisFile, thisTitle) ->
        prevLoader = new HTMLLoader "../#{prevPath}"
        prevLoader.next = thisFile
        prevLoader.nextTitle = thisTitle
        prevLoader.sync()
        prevLoader.write()

    updateTemplateLoader = (templateLoader, thisFile, thisTitle) ->
        oldPrev = templateLoader.prev
        templateLoader.prev = thisFile
        templateLoader.prevTitle = thisTitle
        templateLoader.sync()
        templateLoader.write()
        templateLoader.prev = oldPrev

    updateRel templateLoader.prev, thisFile, thisTitle
    updateTemplateLoader templateLoader, thisFile, thisTitle

createTemplateLoader = ->
    templateLoader = new HTMLLoader 'template.html'

    templateLoader.update = (newLoader) ->
        HTMLLoader.prototype.update.call this, newLoader
        @date = (new Date()).toISOString()

    return templateLoader

try
    htmlLoader = new HTMLLoader filePath.html
catch err
    console.error err
    console.error 'no html file, read `template.html`. '
    htmlLoader = createTemplateLoader()
    maintainTemplate htmlLoader, textLoader
    htmlLoader.path = filePath.html
finally
    htmlLoader.update textLoader
    htmlLoader.sync()
    htmlLoader.write()

