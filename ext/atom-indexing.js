const atom = 'atom.xml'

const q = 'querySelector'
const p = 'getAttribute'
const t = 'textContent'
const c = 'createElement'
const deep = true

class Article {
    static fromAtom(entry) {
        const a = new this()
        a.title = entry.querySelector('title').textContent
        let dateNode =  entry.querySelector('updated') ||
            entry.querySelector('published')
        a.date = new Date(dateNode.textContent)
        a.url = entry.querySelector('link[rel=alternate]').getAttribute('href')
        a.description = entry[q]('summary').textContent
        a.tags = Array.from(entry.querySelectorAll('category'))
            .map((c) => c[p]('term'))
        return a
    }
    createNode() {
        const template = this.constructor.template
        const listNode = this.constructor.listNode
        const node = template.cloneNode(deep)
        window.cnode = node
        node[q]('a').textContent = this.title
        node[q]('a').href = this.url
        node[q]('small').textContent = this.date.toISOString()
        node[q]('p')[t] = this.description
        const ul = node[q]('ul')
        this.tags.map((tag) => {
            let li = document.createElement('li')
            li[t] = tag
            return li
        }).forEach((li) => ul.appendChild(li))
        this.node = node
        listNode.appendChild(node)
    }
    show(bool) {
        if (bool) this.node.classList.remove('hide-article')
        else this.node.classList.add('hide-article')
    }
}

Article.listNode = document[q]('main')
Article.template = document
    .querySelector('#article-template')
    .content
    .querySelector('article')
    .cloneNode(deep)

let loadArticle = ajaxQuery('atom.xml', 'entry').then((allEntry) => {
    allEntry = Array.from(allEntry)
    const articleList = allEntry.map((entry) => Article.fromAtom(entry))
    window.articleList = articleList
    articleList.forEach((article) => {
        article.createNode()
    })
    return articleList
}).then((articleList) => {
    articleList.slice(0,10).forEach((recent) => recent.show(true))
    return articleList
})
