
fs = require 'fs'
marked = require 'marked'

class FileLoaderText
    constructor: (path) ->
        @path = path
        @file = path.replace /^.*\//, ''
        @rawText = fs.readFileSync path, 'utf8'
        @parse()

    parse: ->
        tagsRegexp = /^#\S+$/gm
        @title = @rawText.match(/[^#\n]+/)[0].trim()
        @tags = @rawText.match(tagsRegexp)?.join(',').replace(/#/g, '')
        @main = marked @rawText.replace tagsRegexp, ''

module.exports = FileLoaderText

