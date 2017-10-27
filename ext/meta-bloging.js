
// call in inline script, return the script tag itself.
function prevQuerySelector(selector) {
    const allMatch = document.querySelectorAll(selector)
    const lastMatch = allMatch[allMatch.length - 1]
    return lastMatch
}

// change `:this` to the style id itself
function changeStyleThis(style) {
    let id
    if (style.id) id = style.id
    else {
        const float = Math.random()
        id = 'random-' + String(float).slice(2)
        style.id = id
    }

    style.textContent =
        style.textContent.replace(/:this\b/g, `#${id}`)
}

function evalPrefixJs(node) {
    const jsCode = node.textContent.replace(/^js /, '')
    let evalResult
    try {
        evalResult = eval(jsCode)
    }
    catch (evalError) {
        console.error(evalError)
        node.title = String(evalError)
        return
    }
    node.title = jsCode
    node.textContent = ''
    fillNode(node, evalResult)

}

function fillNode(node, content) {
    if (typeof content != 'string' && content[Symbol.iterator]) {
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
        let textNode = document.createTextNode(String(content))
        node.appendChild(textNode)
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
            try {
                const targetNodes = this.response.querySelectorAll(selector)
                
                if (targetNodes.length == 1) returnNode(targetNodes[0])
                else returnNode(targetNodes)
            }
            catch (queryError) {
                returnError(queryError)
            }
        }
        queryXhr.onerror = returnError
        queryXhr.send()
    })
}

