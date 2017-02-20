
cheerio = require 'cheerio'

class LoaderByCheerio
    constructor: (HTMLText) ->
        @selector = cheerio.load HTMLText, {
            decodeEntities: false
            xmlMode: false
            withDomLvl1: true
            normalizeWhitespace: false,
        }

    date: (setDate) ->
        if setDate
            @selector('meta[name=date]').attr 'content', setDate
        else
            @selector('meta[name=date]').attr 'content'

    index: (setIndex) ->
        if setIndex
            @selector('link[rel=index]').attr 'href', setIndex
        else
            @selector('link[rel=index]').attr 'href'

    prev: (setPrev) ->
        if setPrev
            @selector('link[rel=prev]').attr 'href', setPrev
        else
            @selector('link[rel=prev]').attr 'href'

    next: (setNext) ->
        if setNext
            @selector('link[rel=next]').attr 'href', setNext
        else
            @selector('link[rel=next]').attr 'href'

    title: (setTitle) ->
        if setTitle
            @selector('title').text setTitle
        else
            @selector('title').text()

    main: (setMain) ->
        if setMain
            @selector('main').html setMain
        else
            @selector('main').html

    tags: (setTags) ->
        if setTags
            @selector 'meta[name=keywords]'
                .attr 'content', setTags
        else
            @selector 'meta[name=keywords]'
                .attr 'content'
                .join ','

    update: (newText) ->
        for mustUpdate in ['main', 'title', 'tags']
            @[mustUpdate] newText[mustUpdate]()

        for optionalUpdate in ['date','prev','next']
            if !@[optionalUpdate]()
                @[optionalUpdate] newText[optionalUpdate]?()

    toString: -> @selector.html()

module.exports = LoaderByCheerio

