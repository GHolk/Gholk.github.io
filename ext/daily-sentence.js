
class DailySentence {
    loadFromDataAttribute(node) {
        this.sourceList = node.dataset.sourceList.split(/ /g)
        this.startDate = new Date(node.dataset.startDate)
    }
    async loadAndShow(blockquote) {
        this.loadFromDataAttribute(blockquote)
        const dayCount = this.countDay()
        const sentence = await this.getSentence(dayCount)
        const sourceCount = dayCount % this.sourceList.length
        blockquote.querySelector('a').href = this.sourceList[sourceCount]
        blockquote.append(sentence)
    }
    countDay(date = new Date()) {
        const msDiff = Number(date) - Number(this.startDate)
        const dayDiff = Math.floor(msDiff / (24 * 60 * 60 * 1000))
        return dayDiff
    }
    async getSentence(dayCount = this.countDay()) {
        const document = await this.fetchDocument(dayCount)
        const sentence = this.extractSentence(document, dayCount)
        return sentence
    }
    async fetchDocument(dayCount) {
        const source = this.sourceList[dayCount % this.sourceList.length]
        const response = await fetch(source)
        const html = await response.text()
        const domParser = new DOMParser()
        return domParser.parseFromString(html, 'text/html')
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
        return fragment
    }
}

export {DailySentence}
