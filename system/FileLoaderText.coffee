
fs = require 'fs'
marked = require 'marked'

class FileLoaderText
    constructor: (path) ->
        @path = path
        @file = path.replace /^.*\//, ''
        @rawText = fs.readFileSync path, 'utf8'
        @parse()

    parse: ->
        tagsRegexp = /(\n#\S+)+\s*$/
        @title = @rawText.match(/[^#\n]+/)[0].trim()
        @tags = @rawText.match(tagsRegexp)[0].trim().replace(/#/g, '').split(/\n/g).join(',')
        @main = marked @rawText.replace tagsRegexp, ''

module.exports = FileLoaderText

