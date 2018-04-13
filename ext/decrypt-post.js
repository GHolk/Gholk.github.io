
const loadOpenpgp = injectDecryptHtml()
function injectDecryptHtml() {
    const id = 'decrypt-post'
    let div = document.querySelector(`#${id}`)
    if (!div) {
        div = document.createElement('div')
        div.id = id
        const thisScript = prevQuerySelector('script')
        thisScript.parentNode.insertBefore(div, thisScript)
    }

    const opengpgUrl = 'https://cdnjs.cloudflare.com/ajax/libs/openpgp/3.0.4/openpgp.js'
    const script = document.createElement('script')
    script.src = opengpgUrl
    div.appendChild(script)

    const dataClass = 'encrypt-data'
    document.querySelectorAll(`.${dataClass}`).forEach(encryptNode => {
        const button = document.createElement('button')
        button.textContent = 'decrypt'
        encryptNode.insertBefore(button, encryptNode.firstChild)
    })
    window.addEventListener('click', function (click) {
        const button = click.target
        if (button.matches(`.${dataClass} > button`)) {
            promptDecrypt(button.parentNode)
        }
    })

    return new Promise(function waitOpengpgLoad(finish) {
        if (window.openpgp) finish(window.openpgp)
        else setTimeout(() => waitOpengpgLoad(finish), 500)
    })
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
            break
        }
    }
    const plain = await openpgpDecrypt(textNode.textContent, password)
    const plainNode = document.createElement('article')
    plainNode.textContent = plain
    node.querySelector('button').replaceWith(plainNode)
}
