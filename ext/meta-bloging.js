
var gmeta = {}

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

if (window.Promise) patchPromise(Promise)
function patchPromise(Promise) {
    class Lazy {
        constructor(todo) {
            this.todo = todo
            this.promise = null
        }
        then() {
            if (!this.promise) this.execute()
            return this.promise.then.apply(this.promise, arguments)
        }
        execute() {
            const defer = Promise.defer()
            const result = this.todo(defer.resolve, defer.reject)
            if (result && result.then) this.promise = result
            else this.promise = defer
        }
    }
    Promise.Lazy = Lazy
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



const autoLoader = {
    caseList: [],
    addCase(test, load) {
        this.caseList.push({test, load})
    },
    autoLoad() {
        for (const {test, load} of this.caseList) {
            let result = test()
            if (result) load(result)
        }
    },
    createScript(url) {
        const script = document.createElement('script')
        if (url) script.src = url
        return script
    },
    addScript(url) {
        const script = this.createScript(url)
        document.body.appendChild(script)
    }
}
autoLoader.addCase(
    () => document.querySelector('.encrypt-data'),
    () => autoLoader.addScript('ext/decrypt-post.js')
)

autoLoader.addCase(
    () => document.querySelector('.lang-math'),
    () => autoLoader.addScript('ext/mathjax-block.js')
)

autoLoader.addCase(
    () => document.querySelector('.lang-ptt'),
    () => autoLoader.addScript('ext/ptt-highlight-block.js')
)

const goption = parseQueryOption(location.search.slice(1))

function getParameter(name, currentScript = document.currentScript) {
    const h = 'hasOwnProperty'
    const kebab = camelToKebab(name)
    const scriptUrl = new URL(currentScript.src)
    const scriptQuery = scriptUrl.searchParams
    if (goption[h](name)) return goption[name]
    else if (goption[h](kebab)) return goption[kebab]
    else if (window[h](name)) return window[name]
    else if (currentScript[h](name)) {
        return currentScript[name]
    }
    else if (scriptQuery.has(name)) return scriptQuery.get(name)
    else if (currentScript.dataset[h](name)) {
        return currentScript.dataset[name]
    }
    else return undefined

    function camelToKebab(camel, connect = '-') {
        return camel.replace(/[A-Z]/g, upper => {
            return connect + upper.toLowerCase()
        })
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

function waitLoadOf(event) {
    const interval = 500
    const defer = Promise.defer()
    let test
    if (typeof event == 'string') test = testWindowProperty
    else test = event
    intervalTest()
    return defer

    function testWindowProperty() {
        return window[event]
    }
    function intervalTest() {
        const result = test()
        if (result) defer.resolve(result)
        else setTimeout(intervalTest, interval)
    }
}

function waitScriptTag(url, event) {
    const script = document.createElement('script')
    script.src = url
    document.body.appendChild(script)
    return waitLoadOf(event)
}
