
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
    createBlogNode(template) {
        const node = template.cloneNode(deep)
        node[q]('a').textContent = this.title
        node[q]('a').href = this.url
        node[q]('small').textContent = this.date.toJSON()
        const descriptionNode = this.descriptionNode
        if (descriptionNode.getAttribute('type') == 'html') {
            node[q]('.summary').innerHTML = descriptionNode[t]
        }
        else node[q]('.summary')[t] = descriptionNode[t]
        const ul = node[q]('ul')
        const li = ul[q]('li')
        li.remove()
        for (const tag of this.tags) {
            const tagLi = li.cloneNode(deep)
            tagLi[t] = tag
            ul.appendChild(tagLi)
        }
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

class AtomIndex {
    async loadAtom() {
        const response = await fetch(this.atomUrl)
        const xml = await response.text()
        const domParser = new DOMParser()
        this.atom = domParser.parseFromString(xml, 'application/xml')
    }
    async autoGenerateBlog(document) {
        const linkSelector = 'link[rel=alternate][type="application/atom+xml"]'
        this.atomUrl = document.querySelector(linkSelector).href
        await this.loadAtom()
        this.Article = Article
        this.template = document.getElementById('article-template')
            .content.querySelector('article').cloneNode(deep)
        this.listNode = document.querySelector('main')
        const lazyLoader = this.allArticle()
        const loadTimes = count => {
            for (let i=0; i<count; i++) {
                const node = lazyLoader.next().value
                this.listNode.appendChild(node)
            }
        }
        loadTimes(10)
        document.getElementById('load-more-article').onclick = () => {
            const count = Math.random()*3 + 3
            loadTimes(count)
        }
        return loadTimes
    }
    *allArticle() {
        for (const entry of this.atom.getElementsByTagName('entry')) {
            const article = this.Article.fromAtom(entry)
            article.createBlogNode(this.template)
            yield article.node
        }
    }
}

export {AtomIndex}

