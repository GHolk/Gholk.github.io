#!/usr/bin/env coffee

fs = require 'fs'
path = require 'path'

# escape version marked
marked = require '/home/c34031328/code/marked'

# get filenames
fileNames = do ->
    textFileName = process.argv[process.argv.length - 1]
    throw "no filename given!" if !process.argv[2]
    pathObject = path.parse textFileName

    pathObject.dir = path.join pathObject.dir, '..'
    pathObject.ext = '.html'
    pathObject.base = pathObject.base.replace /\..*?$/, '.html'
    htmlFileName = path.format pathObject

    templateFileName = path.join (path.dirname htmlFileName), 'system/template.html'

    return {
        text: textFileName
        html: htmlFileName
        template: templateFileName
    }

# get metadata from raw text
cookRaw = (rawText) ->
    getTitle = (rawText) ->
        (rawText.match /\S+/)[0]

    getTags = (rawText) ->
        tagsMatch = rawText.match /^#\S+$/gm
        for tag in tagsMatch
            tag.substr 1

    getMain = (rawText) ->
        marked rawText.replace /^#\S+$/gm, ''

    @title = getTitle rawText
    @tags = getTags rawText
    @main = getMain rawText


# get metadata from git or other system
getMeta = (fileName) ->
    console.error "prev, next, date can't access now."

templateReplace = (templateText) ->
    fs.readFile fileNames.text, 'utf8', (err, rawText) ->
        throw err if err

        meta = {}
        cookRaw.call meta, rawText
        getMeta.call meta, fileNames.text

        mealText = templateText
            .replace '{{prev}}', meta.prev
            .replace '{{next}}', meta.next
            .replace '{{date}}', meta.date
            .replace '{{tags}}', meta.tags
            .replace '{{title}}', meta.title
            .replace '\n{{main}}\n', meta.main

        console.log mealText


fs.readFile fileNames.template, 'utf8', (err, templateText) ->
    throw err if err
    templateReplace templateText

