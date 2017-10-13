
/*
class TocHead {
    constructor(level, id, text, children) {
        this.level = level
        this.id = id
        this.text = text
        this.children = children
    }
    static fromNode(node) {
        const level = node.nodeName.match(/^h(\d)$/i)
        const id = node.id
        return new this(level, id, node.textContent, [])
    }
    addChildNode(node) {
        const childToc = new this.constructor.fromNode(node)
        this.children.push(childToc)
    }
    toNode() {
        const a = document.createElement('a')
        a.href = '#' + this.id
        a.textContent = this.text
        
        const ul = document.createElement('ul')
        this.children.map((tocChild) => {
            const childAnchor = tocChild.toNode()
            const li = document.createElement('li')
            li.appendChild(childAnchor)
            return li
        }).reduce((ul, liChild) => {
            ul.appendChild(liChild)
            return ul
        }, ul)

        const fragment = document.createDocumentFragment()
        fragment.appendChild(a)
        fragment.appendChild(ul)

        return fragment
    }
}
*/

const tocScript = prevQuerySelector('script')

window.addEventListener('load', function () {
    const allHeadSelector = 'h1, h2, h3, h4, h5, h6, h7'
    const allHead = document.querySelectorAll(allHeadSelector)
    
    let toc = document.querySelector('#toc')
    if (!toc) {
        toc = document.createElement('div')
        toc.id = 'toc'
        tocScript.parentNode.insertBefore(toc, tocScript.nextSibling)
    }

    Array.from(allHead).reduce((toc, headNode) => {
        toc.appendChild(headToAnchor(headNode))
        return toc
    }, toc)

    function headToAnchor(node) {
        const a = document.createElement('a')
        a.href = '#' + encodeURIComponent(node.id)
        a.textContent = node.textContent

        const hn = document.createElement(node.nodeName.toLowerCase())
        hn.appendChild(a)
        return hn
    }
})
