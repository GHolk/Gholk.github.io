
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

currentList = articleList

queryForm = document.getElementById 'query-article'

outputMatchNumber = queryForm.elements['match-number']

filterByNumberList = (numberList) ->
    document.body.className = '.hide-article'
    currentList.forEach (article) -> article.show false
    currentList = numberList.map (index) -> articleList[index]
    currentList.forEach (article) -> article.show true
    outputMatchNumber.value = numberList.length
    document.body.className = '.show-article'

filterByList = (listToShow) ->
    document.body.className = '.hide-article'
    currentList.forEach (article) -> article.show false
    currentList = listToShow
    currentList.forEach (article) -> article.show true
    outputMatchNumber.value = listToShow.length
    document.body.className = '.show-article'

filterByFunction = (callback) ->
    numberList = []
    currentList
        .map callback
        .forEach (isTrue, index) -> if isTrue then numberList.push index
    filterByNumberList numberList
    return numberList

evalFilterFunction = (conditionStatement) ->
    (article) ->
        {title,url,description,tags,date,raw,node} = article
        hasTag = article.hasTag.bind article
        return eval conditionStatement

queryForm.onsubmit = (evt) ->
    evt.preventDefault()

    conditionStatement = @elements['query-statement'].value
    list = filterByFunction evalFilterFunction conditionStatement
    queryString = '?' + 'eval=' + encodeURIComponent conditionStatement
    history.pushState {list}, "eval #{conditionStatement}", queryString

window.onpopstate = (evt) ->
    if evt.state
        if Array.isArray evt.state.list
            filterByNumberList evt.state.list
    else filterByList articleList

queryForm.elements['show-all'].onclick = (evt) ->
    evt.preventDefault()

    currentList = articleList
    filterByList currentList
    history.pushState null, null, 'index.html'

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

