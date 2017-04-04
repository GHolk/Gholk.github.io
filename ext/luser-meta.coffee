
metaMap = {}

metas = document.getElementsByTagName 'meta'
links = document.getElementsByTagName 'link'

class HyperLink
    createNode = (text, url, title) ->
        node = document.createElement 'a'
        node.textContent = text
        node.href = url
        node.title = title if title
        return node
    constructor: (text, url, title) ->
        @text = text
        @url = url
        @title = title
        @node = createNode text, url, title

HyperLink.fromLink = (link) ->
    new HyperLink link.title, link.href, link.rel

HyperLink.fromTag = (tag) ->
    new HyperLink tag, "index.html?tags=#{tag}"


for meta in metas
    switch meta.name
        when 'date'
            metaMap.date = new Date meta.content
        when 'copyright'
            metaMap.copyright = meta.content
        when 'keywords'
            metaMap.tags = meta.content.split(/,/g).map HyperLink.fromTag
        when 'author'
            metaMap.author = meta.content

for link in links
    switch link.rel
        when 'prev'
            metaMap.prev = HyperLink.fromLink link
        when 'next'
            metaMap.next = HyperLink.fromLink link
        when 'index'
            metaMap.index = HyperLink.fromLink link

window.metaMap = metaMap

defineItem = (name, value, className) ->
    dl = document.createElement 'dl'
    dl.className = className if className

    dt = document.createElement 'dt'
    dt.textContent = name
    dl.appendChild dt

    dd = document.createElement 'dd'
    if value.node
        dd.appendChild value.node
    else if value instanceof Element
        dd.appendChild value
    else
        dd.textContent = value
    dl.appendChild dd

    return dl

footer = document.createElement 'footer'

for key in ['date','author','copyright','tags','prev','index','next']
    footer.appendChild defineItem key, metaMap[key]

document.body.appendChild footer
