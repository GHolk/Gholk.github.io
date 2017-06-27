
class HrArticle
    getTagsFromUl = (ul) ->
        for li in ul.children
            li.textContent.trim()

    constructor: (articleNode) ->
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
        @raw = articleNode.textContent
        @node = articleNode

    hasTag: (tag) ->
        @tags.some (articleTag) -> articleTag == tag

    show: (toShow) ->
        if toShow == true
            @node.className = 'show-article'
        else if toShow == false
            @node.className = 'hide-article'
        else
            return @node.className

articleList = for article in document.getElementsByTagName 'article'
    new HrArticle article

window.articleList = articleList

evalFilterFunction = (conditionStatement) ->
    (article) ->
        {title,url,description,tags,date,raw,node} = article
        hasTag = article.hasTag.bind article
        return eval conditionStatement

queryForm = document.getElementById 'query-article'
queryForm.onsubmit = (evt) ->
    evt.preventDefault()

    conditionStatement = @elements['query-statement'].value
    filterByFunction evalFilterFunction conditionStatement

outputMatchNumber = queryForm.elements['match-number']
filterByFunction = (callback) ->
    articleList.forEach (article) -> article.show false
    matchList = articleList.filter callback
    matchList.forEach (article) -> article.show true
    outputMatchNumber.value = matchList.length

parseQueryString = (queryString) ->
    keyValue = queryString.split /&/g
    queryObject = {}
    for pair in keyValue
        [key, value] = pair.split(/=/).map(decodeURIComponent)
        queryObject[key] = value
    return queryObject

if location.search
    queryObject = parseQueryString location.search.slice 1
    if queryObject.eval
        filterByFunction evalFilterFunction queryObject.eval
    else if queryObject.tags
        theTag = queryObject.tags
        filterByFunction (article) -> article.hasTag theTag

