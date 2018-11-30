const atomUrl = document.querySelector('link[rel=alternate][type="application/atom+xml"]').href

const Article = function ClassArticle () {
    const q = 'querySelector'
    const p = 'getAttribute'
    const t = 'textContent'
    const c = 'createElement'
    const deep = true

    class Article {
        get title() {
            return this.entry[q]('title')[t]
        }
        get date() {
            const entry = this.entry
            const dateNode = entry[q]('updated') || entry[q]('published')
            return new Date(dateNode[t])
        }
        get url() {
            return this.entry[q]('link[rel=alternate]')[p]('href')
        }
        get descriptionNode() {
            return this.entry[q]('summary')
        }
        get description() {
            return this.entry[q]('summary')[t]
        }
        get tags() {
            const tagNode = Array.from(this.entry[q + 'All']('category'))
            return tagNode.map((c) => c[p]('term'))
        }
        get content() {
            return this.entry[q]('content')[t]
        }
        static fromAtom(entry) {
            const a = new this()
            a.entry = entry
            return a
        }
        createNodeNoAppend() {
            const template = this.constructor.template
            const node = template.cloneNode(deep)
            node[q]('a').textContent = this.title
            node[q]('a').href = this.url
            node[q]('small').textContent = this.date.toJSON()
            const descriptionNode = this.descriptionNode
            if (descriptionNode.getAttribute('type') == 'html') {
                node[q]('.summary').innerHTML = descriptionNode[t]
            }
            else node[q]('summary')[t] = descriptionNode[t]
            const ul = node[q]('ul')
            this.tags.map((tag) => {
                let li = document.createElement('li')
                li[t] = tag
                return li
            }).forEach((li) => ul.appendChild(li))
            this.node = node
        }
        createNode() {
            if (!this.node) this.createNodeNoAppend()
            const listNode = this.constructor.listNode
            listNode.appendChild(this.node)
        }
        show(bool) {
            const classList = this.node.classList
            if (bool) classList.remove('hide-article')
            else classList.add('hide-article')
        }
        hasTag(tag) {
            return this.tags.indexOf(tag) != -1
        }
    }

    Article.listNode = document[q]('main')
    Article.template = document
        .querySelector('#article-template')
        .content
        .querySelector('article')
        .cloneNode(deep)

    return Article
}()

function loadAtomUrl(url, lengthLimit) {
    if (lengthLimit == undefined) {
        lengthLimit = Number(getParameter('articleCountLimit')) || 0
    }
    return ajaxQuery(url, 'entry').then((allEntry) => {
        const convertor = convertAtomEntry(allEntry)
        const articleList = []
        for (let i=0;
             i<lengthLimit && i<allEntry.length;
             i++) {
            const article = convertor.next()
            articleList.push(article)
        }
        articleList.convertor = convertor
        return articleList
    })
}

function *convertAtomEntry(entryList) {
    for (const entry of entryList) {
        const article = Article.fromAtom(entry)
        article.createNode()
        yield article
    }
}

const loadArticle = loadAtomUrl(atomUrl)

function asyncLoad(entry) {
    return new Promise((load) => {
        const article = Article.fromAtom(entry)
        article.createNode()
        load(article)
    })
}

