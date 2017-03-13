
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
        query = 'meta[name=date]'
        if setDate?
            @selector(query).attr 'content', setDate
        else
            @selector(query).attr 'content'

    index: (setIndex) ->
        query = 'link[rel=index]'
        if setIndex?
            @selector(query).attr 'href', setIndex
        else
            @selector(query).attr 'href'

    prev: (setPrev) ->
        query = 'link[rel=prev]'
        if setPrev?
            @selector(query).attr 'href', setPrev
        else
            @selector(query).attr 'href'

    next: (setNext) ->
        query = 'link[rel=next]'
        if setNext?
            @selector(query).attr 'href', setNext
        else
            @selector(query).attr 'href'

    title: (setTitle) ->
        query = 'title'
        if setTitle?
            @selector(query).text setTitle
        else
            @selector(query).text()

    main: (setMain) ->
        query = 'main'
        if setMain?
            @selector(query).html setMain
        else
            @selector(query).html()

    tags: (setTags) ->
        query = 'meta[name=keywords]'
        setTags = setTags.join ',' if Array.isArray setTags
        if setTags?
            @selector query
                .attr 'content', setTags
        else
            @selector query
                .attr 'content'

    clear: ->
        for attr in ['main', 'title', 'tags', 'date', 'prev', 'next']
            @[attr] ''

    update: (newText) ->
        for mustUpdate in ['main', 'title', 'tags']
            @[mustUpdate] newText[mustUpdate]()

        for optionalUpdate in ['date','prev','next']
            if !@[optionalUpdate]()
                @[optionalUpdate] newText[optionalUpdate]?()

    toString: -> @selector.html()

module.exports = LoaderByCheerio

