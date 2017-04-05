
class HrArticle
    getTagsFromUl = (ul) ->
        for li in ul.children
            li.textContent.trim()

    constructor: (articleNode) ->
        @node = articleNode
        @title = articleNode
            .getElementsByTagName('h2')[0]
            .textContent
            .trim()
        @url = articleNode
            .getElementsByTagName('h2')[0]
            .children[0]
            .href
        @date = new Date(
            articleNode
                .getElementsByTagName('small')[0]
                .textContent
        )
        @description = articleNode
            .getElementsByTagName('p')[0]
            .textContent
        @tags = getTagsFromUl articleNode.getElementsByTagName('ul')[0]

    containTags: (tags) ->
        @tags.some (articleTag) ->
            tags.some (givenTag) -> givenTag == articleTag

articleList = for article in document.getElementsByTagName 'article'
    new HrArticle article

window.articleList = articleList

regexpSearch = (list, name, regexp) ->
    list.filter (article) -> regexp.test article[name]

window.searchShower =
    node: document.getElementById 'article-list'
    show: (articleList) ->
        for article in articleList
            @node.appendChild article.node
    clear: -> @node.textContent = ''

class SearchCondition
    xWwwUrlEncode = (string) ->
        encodeURIComponent(string).replace(/%20/g,'+')
    addKeyValue = (target, key, value) ->
        switch key
            when 'tags'
                target[key] = value.split(/\+/g).map decodeURIComponent
            else
                target[key] = decodeURIComponent value

    createFromQueryString = (string) ->
        for keyAndValue in string.replace(/^\?/,'').split(/&/g)
            [key,value] = keyAndValue.split '='
            addKeyValue this, key, value
    createFromFormNode = (node) ->
        for input in node.getElementsByTagName 'input'
            addKeyValue this, input.name, input.value
    constructor: (nodeOrUrl) ->
        if typeof nodeOrUrl == 'string'
            createFromQueryString.call this, nodeOrUrl
        else if nodeOrUrl instanceof Node
            createFromFormNode.call this, nodeOrUrl
        else
            throw "not node or queryString"
    toString: -> '?' + (
        for own name,value of this
            "#{name}=#{xWwwUrlEncode(value)}"
    ).join '&'

searchHandler = (query) ->
    searchShower.clear()
    searchShower.show articleList.filter(
        (a) -> a.containTags query.tags
    )

[form] = document.getElementsByTagName 'form'
form.onsubmit = (evt) ->
    evt.preventDefault()
    query = new SearchCondition this
    window.history.pushState query, 'searching...', query.toString()
    searchHandler query

window.onpopstate = ->
    searchHandler new SearchCondition this.location.search

if window.location.search
    searchHandler new SearchCondition window.location.search

