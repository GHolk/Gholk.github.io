
// call in inline script, return the script tag itself.
function prevQuerySelector(selector) {
    const allMatch = document.querySelectorAll(selector)
    const lastMatch = allMatch[allMatch.length - 1]
    return lastMatch
}

// change `:this` to the style id itself
function changeStyleThis(style) {
    const thisRegexp = /:this\b/g
    const cssText = style.textContent
    if (thisRegexp.test(cssText)) {
        const id = haveId(style)
        style.textContent = cssText.replace(thisRegexp, '#' + id)
    }

    function haveId(style) {
        if (style.id) return style.id
        else {
            const float = Math.random()
            const id = 'random-' + String(float).slice(2)
            style.id = id
            return id
        }
    }
}

function evalPrefixJs(node) {
    const jsCode = node.textContent.replace(/^js /, '')
    let evalResult
    try {
        evalResult = eval(jsCode)
    }
    catch (evalError) {
        console.error(jsCode)
        console.error(evalError)
        node.title = String(evalError)
        return
    }
    node.title = jsCode
    node.textContent = ''
    fillNode(node, evalResult)

}

function fillNode(node, content) {
    if (typeof content.toNode == 'function') {
        fillNode(node, content.toNode())
    }
    else if (typeof content != 'string' && content[Symbol.iterator]) {
        for (let x of content) {
            fillNode(node, x)
        }
    }
    else if (typeof content.then == 'function') {
        content.then((promiseValue) => fillNode(node, promiseValue))
    }
    else if (typeof content == 'function') content(node)
    else if (content instanceof Node) node.appendChild(content)
    else {
        const textNode = document.createTextNode(String(content))
        fillNode(node, textNode)
    }
}

window.addEventListener('load', () => {
    let allStyle = document.querySelectorAll('style')
    Array.from(allStyle).forEach(changeStyleThis)

    let evalNode = document.querySelectorAll('code')
    evalNode = Array.from(evalNode)
        .filter((code) => /^js[\s\n]/.test(code.textContent))
    evalNode.forEach(evalPrefixJs)
})

function ajaxQuery(url, selector) {
    return new Promise((returnNode, returnError) => {
        const queryXhr = new XMLHttpRequest()
        queryXhr.open('GET', url)
        queryXhr.responseType = 'document'
        queryXhr.onload = function () {
            if (!selector) returnNode(this)
            else {
                try {
                    const targetNodes = this.response.querySelectorAll(selector)
                    
                    if (targetNodes.length == 1) returnNode(targetNodes[0])
                    else returnNode(targetNodes)
                }
                catch (queryError) {
                    returnError(queryError)
                }
            }
        }
        queryXhr.onerror = returnError
        queryXhr.send()
    })
}

patchPromise()
function patchPromise() {
    Promise.lazy = function (todo) {
        const lazy = {}
        lazy.todo = todo
        lazy.promise = null
        lazy.then = function () {
            if (!this.promise) this.promise = new Promise(this.todo)
            this.promise.then.apply(this.promise, arguments)
        }
        return lazy
    }
    if (!Promise.defer) Promise.defer = function () {
        const defer = {}
        const promise = new this((resolve, reject) => {
            defer.resolve = resolve
            defer.reject = reject
        })
        defer.promise = promise
        defer.then = promise.then.bind(promise)
        defer.catch = promise.catch.bind(promise)
        return defer
    }
}

function parseQueryOption(query) {
    const keyValue = query.split(/&/g)
    const result = {}
    for (const pair of keyValue) {
        const keyValue = pair.split(/=/)
        const key = decodeURIComponent(keyValue[0])
        const value = decodeURIComponent(keyValue[1])
        result[key] = value
    }
    return result
}

function detectLoader() {
    autoDecrypt()
    function createScript(url) {
        const script = document.createElement('script')
        if (url) script.src = url
        return script
    }
    function autoDecrypt() {
        if (document.querySelector('.encrypt-data')) {
            const script = createScript('ext/decrypt-post.js')
            document.body.appendChild(script)
        }
    }
}

const goption = parseQueryOption(location.search.slice(1))
