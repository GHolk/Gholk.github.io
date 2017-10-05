
void function () {
    let codeNode = document.querySelectorAll(':not(pre) code')
    codeNode = Array.from(codeNode)
        .filter((code) => /^js /.test(code.textContent))
    codeNode.forEach((code) => {
        const jsCode = code.textContent.replace(/^js /, '')
        let evalResult
        try {
            evalResult = eval(jsCode)
        }
        catch (evalError) {
            evalResult = null
        }
        finally {
            if (evalResult) {
                code.title = jsCode
                code.textContent = ''
                showResult(code, evalResult)
            }
        }
    })

    function showResult(node, result) {
        if (result[Symbol.iterator]) {
            for (let x of result) {
                showResult(node, x)
            }
        }
        else if (typeof result.then == 'function') {
            result.then((promiseValue) => showResult(node, promiseValue))
        }
        else if (typeof result == 'function') result(node)
        else if (result instanceof Node) node.appendChild(result)
        else {
            let textNode = document.createTextNode(String(result))
            node.appendChild(textNode)
        }
    }
}()
