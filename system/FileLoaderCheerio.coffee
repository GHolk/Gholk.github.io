
cheerio = require 'cheerio'
fs = require 'fs'

class FileLoaderByCheerio
    constructor: (path) ->
        @path = path
        @selector = cheerio.load fs.readFileSync path, 'utf8'
        @parse()

    parse: ->
        @date = @selector('meta[name=date]').attr 'content'
        @tags = @selector('meta[name=keywords]').attr 'content'
        @title = @selector('title').text()
        @prev = @selector('link[rel=prev]').attr 'href'
        @next = @selector('link[rel=next]').attr 'href'
        @main = @selector('main').html()

    sync: ->
        @selector('meta[name=date]').attr 'content', @date
        @selector('meta[name=keywords]').attr 'content', @tags
        @selector('title').text @title
        @selector('link[rel=prev]').attr 'href', @prev
        @selector('link[rel=next]').attr 'href', @next
        @selector('main').html @main

    update: (newLoader) ->
        for key in ['date', 'tags', 'prev', 'next', 'title', 'main']
            @[key] = newLoader[key]

    write: (path) ->
        @path = path if path
        fs.writeFileSync @path, @selector.html(), 'utf8'

module.exports = FileLoaderByCheerio
