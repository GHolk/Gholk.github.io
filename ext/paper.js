
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
        const toExecute = execute ||
              getParameter('execute') != undefined ||
              getParameter('reference') != undefined
        if (toExecute) {
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
if (getParameter('reference') != undefined) {
    const reference = {
        createEntry(title) {
            const dl = document.createElement('dl')
            const dt = this.toNode('dt', title)
            dl.appendChild(dt)
            return dl
        },
        toNode(tag, string, className = '') {
            const node = document.createElement(tag)
            node.textContent = string
            if (className) node.className = className
            return node
        },
        createAnchorEntry(title, url, context) {
            const dl = this.createEntry(title)
            dl.classList.add('url')
            dl.appendChild(this.toNode('dd', url, 'url'))
            dl.appendChild(this.toNode('dd', context, 'context'))
            return dl
        },
        createImageEntry(title, url) {
            const dl = this.createEntry(title)
            dl.classList.add('image')
            dl.appendChild(this.toNode('dd', url, 'url'))
            return dl
        },
        node: document.createDocumentFragment(),
        urlList: [],
        addAnchor(title, url, context) {
            let index = this.urlList.indexOf(url) + 1
            if (index == 0) {
                index = this.urlList.push(url)
                const entry = this.createAnchorEntry(title, url, context)
                entry.querySelector('dt').dataset.referenceId = index
                this.node.appendChild(entry)
            }
            return index
        },
        imageCount: 1,
        addImage(title, url) {
            const entry = this.createImageEntry(title, url)
            const dt = entry.querySelector('dt')
            dt.dataset.referenceId = this.imageCount
            dt.dataset.referenceCjk =
                gmeta.patchCjkCounter.numberToCjk(this.imageCount)
            this.node.appendChild(entry)
            this.imageCount += 1
            return this.imageCount
        },
        render() {
            const main = document.querySelector('main')
            let header = document.querySelector('h2.reference')
            if (!header) {
                header = document.createElement('h2')
                header.textContent = '參考資料'
                header.classList.add('reference')
                main.appendChild(header)
            }
            header.after(this.node)
        }
    }

    gmeta.postPaper.regist('a:not(.image)', a => {
        const index = reference.addAnchor(a.title, a.href, a.textContent)
        a.dataset.referenceId = index
    })
    gmeta.postPaper.regist('figure', figure => {
        const caption = figure.querySelector('figcaption')
        const title = caption.textContent
        const urlNode = figure.querySelector('a, img')
        let url = urlNode.href || urlNode.src
        const index = reference.addImage(title, url)
        caption.dataset.referenceId = index
    })
    gmeta.postPaper.regist('body', () => reference.render())
    gmeta.reference = reference

    // window.addEventListener('load', () => reference.render())
}
gmeta.patchCjkCounter = {
    count: 1,
    string: '一二三四五六七八九十',
    numberToCjk(n) {
        if (n <= 10) return this.string.charAt(n-1)
        else if (n <= 19) {
            return this.string.charAt(9) + this.numberToCjk(n-10)
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
