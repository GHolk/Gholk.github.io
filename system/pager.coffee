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

        updatePrevNext = (oldHTMLPath, nextFileName) ->
            whenOldHTMLRead = (err, HTMLText) ->
                throw err if err

                oldHTMLLoader = new Loader HTMLText
                oldHTMLLoader.next nextFileName

                try
                    fs.writeFile(
                        oldHTMLPath
                        oldHTMLLoader.toString()
                        'utf8'
                        (err) -> throw err if err
                    )
                catch err
                    console.error err
                    console.error "can't write to `#{oldHTMLPath}` . "
            try
                fs.readFile oldHTMLPath, 'utf8', whenOldHTMLRead
            catch err
                console.error err
                console.error "have no prev html file `#{oldHTMLPath}` . "

        updatePrevNext(
            '../' + HTMLLoader.prev()
            fileNames.html.slice 3
        )

        HTMLLoader.update textLoader

        whenHTMLWrite = (err) ->
            throw err if err

            HTMLLoader.clear()

            # from '../foo.html' to 'foo.html'
            HTMLLoader.prev fileNames.html.slice 3

            fs.writeFile(
                fileNames.template
                HTMLLoader.toString()
                'utf8'
                (err) -> throw err if err
            )

        fs.writeFile(
            fileNames.html
            HTMLLoader.toString()
            'utf8'
            whenHTMLWrite
        )

    fs.readFile fileNames.html, 'utf8', whenHTMLFileReady

fs.readFile fileNames.text, 'utf8', whenTextFileReady


