
class DailySentence {
    loadFromDataAttribute(node) {
        this.sourceList = node.dataset.sourceList.split(/ /g)
        this.startDate = new Date(node.dataset.startDate)
    }
    loadFromAtom(atom) {
        const dailyList = Array.from(
            atom.querySelectorAll('category[term=daily]')
        ).map(category => category.parentNode)
        const funnyList = Array.from(
            atom.querySelectorAll('category[term=funny]')
        ).map(category => category.parentNode)

        const linkSelector = 'link[rel=alternate][type="text/html"]'
        const urlList = []
        for (const daily of dailyList) {
            if (~funnyList.indexOf(daily)) {
                const link = daily.querySelector(linkSelector)
                const url = new URL(link.getAttribute('href'))
                url.hash = ''
                const urlString = url.pathname.slice(1)
                if (! ~urlList.indexOf(urlString)) urlList.unshift(urlString)
            }
        }
        this.sourceList = urlList
    }
    loadFromAtomXpath(atom) {
        const root = atom.documentElement
        const nsResolver = atom.createNSResolver(root)
        const result = atom.evaluate(
            `/feed/entry[category[@term="funny"] and
                         category[@term="daily"]]
                        /link[@rel="alternate" and 
                              @type="text/html"]
                             /@href`, 
            root, nsResolver,
            XPathResult.STRING_TYPE, null
        )
        
    }
    async loadAndShow(atom, blockquote) {
        this.loadFromAtom(atom)
        this.startDate = new Date(blockquote.dataset.startDate)
        const dayCount = this.countDay()
        const result = await this.getSentence(dayCount)
        blockquote.querySelector('a').href =
            result.source +
            `?scroll-to-selector=hr:nth-of-type(${result.index+1})`
        blockquote.append(result.sentence)
    }
    countDay(date = new Date()) {
        const msDiff = Number(date) - Number(this.startDate)
        const dayDiff = Math.floor(msDiff / (24 * 60 * 60 * 1000))
        return dayDiff
    }
    async getSentence(dayCount = this.countDay()) {
        const {source, document} = await this.fetchDocument(dayCount)
        const {index, sentence} = this.extractSentence(document, dayCount)
        return {source, index, sentence}
    }
    async fetchDocument(dayCount) {
        const source = this.sourceList[dayCount % this.sourceList.length]
        const response = await fetch(source)
        const html = await response.text()
        const domParser = new DOMParser()
        return {source, document: domParser.parseFromString(html, 'text/html')}
    }
    extractSentence(document, dayCount) {
        const main = document.querySelector('main')
        const hrList = main.getElementsByTagName('hr')
        const index = dayCount % hrList.length

        const nodeList = []
        for (let node = hrList[index].nextSibling;
             node != null && node.tagName != 'HR';
             node = node.nextSibling) {
            nodeList.push(node)
        }
        const fragment = document.createDocumentFragment()
        for (const node of nodeList) fragment.appendChild(node)
        return {index, sentence:fragment}
    }
}

export {DailySentence}
