
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
        node = @selector 'meta[name=date]'
        if setDate?
            node.attr 'content', setDate
        else
            node.attr 'content'

    index: (setIndex) ->
        node = @selector 'link[rel=index]'
        if setIndex?
            node.attr 'href', setIndex
        else
            node.attr 'href'

    prev: (setPrev) ->
        node = @selector 'link[rel=prev]'
        if setPrev == 'remove'
            node.remove()
        else if setPrev?
            node.attr 'href', setPrev
        else
            node.attr 'href'

    next: (setNext) ->
        node = @selector 'link[rel=next]'
        if setNext == 'remove'
            node.remove()
        else if setNext?
            node.attr 'href', setNext
        else
            node.attr 'href'

    title: (setTitle) ->
        node = @selector 'title'
        if setTitle?
            node.text setTitle
        else
            node.text()

    main: (setMain) ->
        node = @selector 'main'
        if setMain?
            node.html setMain
        else
            node.html()

    tags: (setTags) ->
        node = @selector 'meta[name=keywords]'
        setTags = setTags.join ',' if Array.isArray setTags
        if setTags?
            node.attr 'content', setTags
        else
            node.attr 'content'

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

