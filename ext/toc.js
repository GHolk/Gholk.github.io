
const tocScript = prevQuerySelector('script')

window.addEventListener('load', function () {
    const allHeadSelector = 'h1, h2, h3, h4, h5, h6, h7'
    const allHead = document.querySelectorAll(allHeadSelector)
    
    let toc = document.querySelector('#toc')
    if (!toc) {
        toc = document.createElement('div')
        toc.id = 'toc'
        tocScript.parentNode.insertBefore(toc, tocScript)
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
