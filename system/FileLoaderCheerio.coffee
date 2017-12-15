
cheerio = require 'cheerio'
fs = require 'fs'

class FileLoaderCheerio
    constructor: (path) ->
        @path = path
        @file = path.replace /^.*\//, ''
        @selector = cheerio.load (fs.readFileSync path, 'utf8'), {
            decodeEntities: false
            xmlMode: false
            withDomLvl1: true
            normalizeWhitespace: false
        }
        @parse()

    parse: ->
        @file = @path.replace /^.*\//, ''
        @date = @selector('meta[name=date]').attr 'content'
        @tags = @selector('meta[name=keywords]').attr 'content'
        @title = @selector('title').text()
        @prev = @selector('link[rel=prev]').attr 'href'
        @prevTitle = @selector('link[rel=prev]').attr 'title'
        @next = @selector('link[rel=next]').attr 'href'
        @nextTitle = @selector('link[rel=next]').attr 'title'
        @main = @selector('main').html()
        @description =
            @selector('main > :not(h1)').first().text()

    sync: ->
        @selector('meta[name=date]').attr 'content', @date
        @selector('meta[name=keywords]').attr 'content', @tags
        @selector('title').text @title
        @selector('link[rel=prev]').attr 'href', @prev
        @selector('link[rel=prev]').attr 'title', @prevTitle
        @selector('link[rel=next]').attr 'href', @next
        @selector('link[rel=next]').attr 'title', @nextTitle
        @selector('main').html @main
        @description =
            @selector('main > :not(h1)').first().text()
        @file = @path.replace /^.*\//, ''

    update: (newLoader) ->
        for key in ['tags', 'title', 'main']
            @[key] = newLoader[key]

    write: (path = @path) ->
        fs.writeFileSync path, @selector.html(), 'utf8'

module.exports = FileLoaderCheerio

