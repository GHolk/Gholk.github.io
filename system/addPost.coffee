
fs = require 'fs'
HTMLLoader = require './FileLoaderCheerio'
IndexLoader = require './IndexLoader'
marked = require 'marked'

filePath = do ->
    text = process.argv.slice(-1)[0]
    html = text.replace('text/','').replace('.txt','.html')
    template = 'template.html'
    index = '../index.html'
    return {text,html,template,index}

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
        oldPrev = [templateLoader.prev, templateLoader.prevTitle]
        templateLoader.prev = thisFile
        templateLoader.prevTitle = thisTitle
        templateLoader.sync()
        templateLoader.write()
        [templateLoader.prev, templateLoader.prevTitle] = oldPrev

    updateRel templateLoader.prev, thisFile, thisTitle
    updateTemplateLoader templateLoader, thisFile, thisTitle

createTemplateLoader = ->
    templateLoader = new HTMLLoader filePath.template

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
    maintainTemplate(
        htmlLoader
        textLoader.file.replace /\.txt$/, '.html'
        textLoader.title
    )
    htmlLoader.path = filePath.html
finally
    htmlLoader.update textLoader
    htmlLoader.sync()
    htmlLoader.write()


index = new IndexLoader filePath.index
index.add htmlLoader
index.write()

