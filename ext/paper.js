
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
gmeta.patchCjkCounter = {
    count: 1,
    string: '一二三四五六七八九十',
    numberToCjk(n) {
        if (n <= 10) return this.string.charAt(n-1)
        else if (n <= 19) {
            return this.string.charAt(9) + this.numberToCjk(n)
        }
        else if (n <= 99) {
            const ten = Math.floor(n / 10)
            let one
            if (n % 10 == 0) one = ''
            else one = this.numberToCjk(n % 10)
            return this.numberToCjk(ten) + this.string.charAt(9) + one
        }
        else return n
    },
    patchNode(node) {
        const cjk = this.numberToCjk(this.count)
        if (node.textContent.trim()) {
            node.textContent = cjk
        }
        else {
            node.textContent = cjk + this.separator + node.textContent
        }
        this.counter++
    },
    create() {
        const child = Object.create(this)
        child.count = 1
        return child
    },
    testPatchSelector(selector) {
        if (!CSS.supports('content: counter(foo, cjk-decimal)')) {
            const child = this.create()
            for (const node of document.querySelectorAll(selector)) {
                child.patchNode(node)
            }
        }
    }
}


gmeta.postPaper.auto()
