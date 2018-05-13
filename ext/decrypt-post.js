
const loadOpenpgp = injectDecryptHtml()
if (getParameter('marked')) markedWhenDecrypt()

function injectDecryptHtml() {

    const opengpgUrl =
        'https://cdnjs.cloudflare.com/ajax/libs/openpgp/3.0.4/openpgp.js'
    const loadOpenpgp = waitScriptTag(opengpgUrl, 'openpgp')

    const dataClass = 'encrypt-data'
    for (const encrypt of document.getElementsByClassName(dataClass)) {
        const button = createDecryptButton()
        encrypt.insertBefore(button, encrypt.firstChild)
    }
    
    return loadOpenpgp

    function createDecryptButton() {
        const button = document.createElement('button')
        button.onclick = clickPromptDecrypt
        button.textContent = 'decrypt'
        return button
    }
    function clickPromptDecrypt(click) {
        const encryptContainer = click.target.parentNode
        promptDecrypt(encryptContainer)
    }
}

async function openpgpDecrypt(ascii, password) {
    const openpgp = await loadOpenpgp
    const message = openpgp.message.readArmored(ascii)
    const plain = await openpgp.decrypt({message, passwords: password})
    return plain.data
}

async function promptDecrypt(node, password = prompt('password')) {
    let textNode
    for (const child of node.childNodes) {
        if (child.nodeType == Node.TEXT_NODE) {
            textNode = child
        }
    }
    let plain
    try {
        plain = await openpgpDecrypt(textNode.textContent, password)
    }
    catch (decryptError) {
        console.error(decryptError)
        alert('error password')
        plain = null
    }
    
    if (plain) {
        const plainNode = document.createElement('article')
        plainNode.textContent = plain
        node.querySelector('button').replaceWith(plainNode)
    }
}

function markedWhenDecrypt() {
    const loadMarked = waitScriptTag(
        'http://gholk.github.io/marked/marked.min.js',
        'marked'
    )
    const encryptNodes = document.getElementsByClassName('encrypt-data')
    for (const encrypt of encryptNodes) markedDecryptText(encrypt)

    async function markedDecryptText(node) {
        const marked = await loadMarked
        const article = await waitLoadOf(() => node.querySelector('article'))
        article.classList.add('html')
        article.innerHTML = marked(article.textContent)
    }
}
