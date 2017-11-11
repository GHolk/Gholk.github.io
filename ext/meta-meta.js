
// external:
// fillNode, prevQuerySelector

class HyperLink {
    constructor(text, url, title) {
        this.text = text
        this.url = url
        if (title) this.title = title
    }
    toNode() {
        const a = document.createElement('a')
        a.href = this.url
        a.text = this.text
        if (this.title) a.title = this.title
        return a
    }
    static fromLink(link) {
        return new this(link.title, link.href, link.rel)
    }
}

class MetaItem {
    constructor(name, value, className) {
        this.name = name
        this.value = value
        if (className) this.className = className
    }
    toNode() {
        const dt = document.createElement('dt')
        fillNode(dt, this.name)
        
        const dd = document.createElement('dd')
        fillNode(dd, this.value)

        const dl = document.createElement('dl')
        if (this.className) dl.className = this.className
        fillNode(dl, dt)
        fillNode(dl, dd)

        return dl
    }
}

void function () {

const metaList = function () {
    const allMeta = document.querySelectorAll('meta')
    const metaList = []

    Array.from(allMeta).forEach((node) => {
        switch (node.name) {
        case 'date':
            const date = new Date(node.content)
            date.toString = date.toJSON
            addMeta('date', date)
            break
        case 'keywords':
            const tags = node.content.split(/,/g)
            tags.toNode = tags.toString
            addMeta('tags', tags)
            break
        case 'copyright':
        case 'author':
            addMeta(node.name, node.content)
            break
        }
    })
    
    return metaList

    function addMeta(name, value) {
        metaList.push(
            new MetaItem(name, value)
        )
    }
}()

const linkList = ['prev', 'index', 'next']
      .map((rel) => {
          const node = prevQuerySelector(`link[rel=${rel}`)
          if (node) {
              return new MetaItem(
                  node.rel,
                  HyperLink.fromLink(node),
                  'browser-only'
              )
          }
          else return null
      })
      .filter((exist) => Boolean(exist))

const url = function () {
    let url
    const canonical = prevQuerySelector('link[rel=canonical]')
    if (canonical) url = canonical.href
    else url = window.location.href
    
    const key = 'url'
    const value = new HyperLink(url, url)
    const className = 'print-only'
        
    return new MetaItem(key, value, className)
}()

const allList = metaList.concat(linkList).concat(url)

let footer = document.querySelector('footer')
if (!footer) {
    footer = document.createElement('footer')
    document.body.appendChild(footer)
}

fillNode(footer, allList)

}()
