
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
        if (result instanceof Node) node.appendChild(result)
        else if (result instanceof Array) {
            result.forEach((x) => showResult(node, x))
        }
        else node.textContent += result
    }
}()
