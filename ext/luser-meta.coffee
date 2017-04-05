

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
    value = tagsString.split(/,/g).map HyperLink.fromTag
    value.toNode = -> arrayToUl this
    new MetaItem 'tags', value

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

metaMap = []
metaMap.toNode = ->
    div = document.createElement 'div'
    for meta in this
        div.appendChild meta.toNode()
    return div

for meta in metas
    switch meta.name
        when 'keywords'
            metaMap.push MetaItem.createTags meta.content
        when 'date'
            metaMap.push MetaItem.createDate meta.content
        when 'copyright', 'author'
            metaMap.push new MetaItem meta.name, meta.content


linkMap = []
linkMap.toNode = ->
    node = arrayToUl this
    node.className = 'browser-only'

for link in links
    switch link.rel
        when 'prev', 'next', 'index'
            linkMap.push HyperLink.fromLink link

footer = document.createElement 'footer'

footer.appendChild metaMap.toNode()
footer.appendChild linkMap.toNode()
document.body.appendChild footer

