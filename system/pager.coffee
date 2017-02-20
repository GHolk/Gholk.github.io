#!/usr/bin/env coffee

fs = require 'fs'
path = require 'path'
Loader = require './LoaderByCheerio.js'

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


class HTMLFromText
    constructor: (text) ->
        @rawText = text

    tags: ->
        tagsMatch = (@rawText.match /\n#\S+/g) || []
        for tag in tagsMatch
            tag.substr 2

    title: ->
        (@rawText.match /.+/)[0]

    date: ->
        date = new Date()
        date.toISOString()

    main: ->
        marked @rawText.replace /\n#\S+/g, ''


whenTextFileReady = (err, rawText) ->
    throw err if err

    textLoader = new HTMLFromText rawText

    whenHTMLFileReady = (err, HTMLText) ->
        if err
            fs.readFile fileNames.template, 'utf8', whenTemplateFileReady
        else
            HTMLLoader = new Loader HTMLText
            HTMLLoader.update textLoader
            fs.writeFile fileNames.html, HTMLLoader.toString(), 'utf8', ->
    
    whenTemplateFileReady = (err, HTMLText) ->
        throw err if err
    
        HTMLLoader = new Loader HTMLText
        HTMLLoader.update textLoader
        fs.writeFile fileNames.html, HTMLLoader.toString(), 'utf8', ->

    fs.readFile fileNames.html, 'utf8', whenHTMLFileReady

fs.readFile fileNames.text, 'utf8', whenTextFileReady


