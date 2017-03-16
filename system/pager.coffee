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
        (tag.substr 2 for tag in tagsMatch).join ','
        # strip leading '#hashtag'

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

        templateLoader = new Loader HTMLText

        updatePrevNext = (oldHTMLPath, nextFileName, nextFileTitle) ->
            whenOldHTMLRead = (err, HTMLText) ->
                throw err if err

                oldHTMLLoader = new Loader HTMLText
                oldHTMLLoader.next nextFileName, nextFileTitle

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

        isHide = textLoader.tags().split(',').indexOf('hide') != -1
        if isHide
            templateLoader.prev 'remove'
            templateLoader.next 'remove'
        else
            updatePrevNext(
                '../' + templateLoader.prev()
                fileNames.html.slice 3
                textLoader.title()
            )

        templateLoader.update textLoader

        whenHTMLWrite = (err) ->
            throw err if err

            templateLoader.clear()

            # from '../foo.html' to 'foo.html'
            templateLoader.prev fileNames.html.slice 3

            fs.writeFile(
                fileNames.template
                templateLoader.toString()
                'utf8'
                (err) -> throw err if err
            )

        fs.writeFile(
            fileNames.html
            templateLoader.toString()
            'utf8'

            if isHide
            then (err) -> throw err if err
            else whenHTMLWrite
        )

    fs.readFile fileNames.html, 'utf8', whenHTMLFileReady

fs.readFile fileNames.text, 'utf8', whenTextFileReady


