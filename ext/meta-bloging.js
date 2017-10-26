
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

function github(author){}

let flk = {}
flk.map = null
flk.set = function (names, infos) {
    this.map = {}
    names.forEach((name, i) => {
        this.map[name] = infos[i]
    })
}
flk.getNode = function (test) {
    const map = this.map
    if (map[test]) return this.toNode(map[test])
    else {
        for (let name in map) {
            if (name.match(test)) {
                return this.toNode(map[test])
            }
        }
    }
}

flk.toNode = function (info) {
    const i = info
    const page = `https://flickr.com/photos/${i.user}/${i.photo}`
    const image =
          `https://${i.farm}.staticflickr.com/${i.server}/${i.photo}_${i.secret}.jpg`
    const embedScript = 'https://embedr.flickr.com/assets/client-code.js'

    const a = document.createElement('a')
    a.href = page
    a.setAttribute('data-flickr-embed', true)

    const img = document.createElement('img')
    img.src = image
    a.appendChild(img)

    const script = document.createElement('script')
    script.src = embedScript
    script['async'] = true
    script.charset = 'utf-8'
    a.appendChild(script)

    return a
}
