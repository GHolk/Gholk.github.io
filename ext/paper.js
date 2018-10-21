
if (!window.gmeta) window.gmeta = {}
 
gmeta.postPaper = {
    list: [],
    regist(selector, todo) {
        this.list.push({selector, todo})
    },
    executeItem({selector, todo}) {
        document.querySelectorAll(selector).forEach(todo)
    },
    auto(execute) {
        console.log('autoing')
        if (execute || getParameter('execute') != undefined) {
            for (const item of this.list) this.executeItem(item)
        }
    }
}
gmeta.postPaper.regist('a', (anchor) => {
    if (anchor.querySelector('img')) anchor.classList.add('image')
})
gmeta.postPaper.regist('img', (image) => {
    let p
    if (image.parentNode.nodeName == 'P') p = image.parentNode
    if (image.parentNode.parentNode.nodeName == 'P') {
        p = image.parentNode.parentNode
    }
    if (p && p.childNodes.length == 1) {
        const figure = document.createElement('figure')
        figure.appendChild(p.childNodes[0])
        const caption = document.createElement('figcaption')
        if (image.title) caption.textContent = image.title
        else caption.textContent = image.parentNode.href || image.src
        figure.appendChild(caption)
        p.replaceWith(figure)
    }
})
gmeta.postPaper.regist('table', (table) => {
    const caption = document.createElement('caption')
    if (table.title) caption.textContent = table.title
    table.appendChild(caption)
})

gmeta.postPaper.auto()
