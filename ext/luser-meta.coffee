

metas = document.getElementsByTagName 'meta'
links = document.getElementsByTagName 'link'

arrayToUl = (array) ->
    wrapLi = (object) ->
        li = document.createElement 'li'
        if object.toNode
            li.appendChild object.toNode()
        else if object instanceof Node
            li.appendChild object
        else
            li.textContent = object
        return li
    ul = document.createElement 'ul'
    for i in array
        ul.appendChild wrapLi i
    return ul

class HyperLink
    constructor: (text, url, title) ->
        @text = text
        @url = url
        @title = title if title
    toNode: ->
        node = document.createElement 'a'
        node.href = @url
        node.textContent = @text
        node.title = @title if @title
        return node

HyperLink.fromLink = (link) ->
    new HyperLink link.title, link.href, link.rel

HyperLink.fromTag = (tag) ->
    new HyperLink tag, "index.html?tags=#{tag}"


class MetaItem
    constructor: (name, value) ->
        @name = name
        @value = value
    toNode: ->
        dl = document.createElement 'dl'
        dl.className = @className if @className

        dt = document.createElement 'dt'
        dt.textContent = @name
        dl.appendChild dt

        dd = document.createElement 'dd'
        if @value?.toNode
            dd.appendChild @value.toNode()
        else if @value instanceof Node
            dd.appendChild @value
        else
            dd.textContent = @value
        dl.appendChild dd

        return dl

MetaItem.createDate = (dateString) ->
    date = new Date dateString
    date.toString = date.toISOString
    new MetaItem 'date', date

MetaItem.createTags = (tagsString) ->
    value = tagsString.split(/,/g)
    if /^\/[^\/]*$/.test window.location.pathname
        value = value.map HyperLink.fromTag
    value.toNode = -> arrayToUl this
    new MetaItem 'tags', value

metaMap = for meta in metas
    switch meta.name
        when 'keywords'
            MetaItem.createTags meta.content
        when 'date'
            MetaItem.createDate meta.content
        when 'copyright', 'author'
            new MetaItem meta.name, meta.content

metaMap.toNode = ->
    div = document.createElement 'div'
    for meta in this when meta
        div.appendChild meta.toNode()
    return div


linkMap = for link in links
    switch link.rel
        when 'prev', 'index', 'next'
            new MetaItem link.rel, new HyperLink.fromLink link
linkMap.toNode = ->
    div = document.createElement 'div'
    for link in this when link
        div.appendChild link.toNode()
    div.id = 'rel-page'
    div.className = 'browser-only'
    return div

footer = do ->
    footerList = document.getElementsByTagName 'footer'
    return footerList[footerList.length - 1]

footer.appendChild metaMap.toNode()
footer.appendChild linkMap.toNode()

