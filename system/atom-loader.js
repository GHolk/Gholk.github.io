const fs = require('fs')
const cheerio = require('cheerio')

class AtomLoader {
    constructor(path) {
        if (!path) path = '../atom.xml'
        this.path = path
        const option = {
            decodeEntities: false,
            xmlMode: true,
            normalizeWhitespace: false
        }
        this.selector = cheerio.load(fs.readFileSync(path), option)
        this.baseUri = 'http://gholk.github.io'
    }
    write() {
        const current = new Date()
        this.selector('feed > updated:first-of-type')
            .text(current.toISOString())
        fs.writeFileSync(
            this.path,
            this.selector.html(),
            'utf8'
        )
    }
    add(loader) {
        const tags = loader.tags.split(/,/g).map(tagToAtom).join('\n')
        const currentDate = new Date()
        const entry = this.selector('<entry>')
        entry.html(`
<id>${loader.file}</id>
<title>${loader.title}</title>
<published>${loader.date}</published>
<updated>${currentDate.toISOString()}</updated>
<link rel="alternate" type="text/html"
      href="${this.baseUri}/${loader.file}" />
<summary>${loader.description}</summary>
${tags}
`)
        const searchOgImage = loader.selector('meta[property="og:image"]')
        if (searchOgImage.length > 0) {
            const meta = searchOgImage.last()
            const link = this.selector('<link rel="alternate">')
            link.attr('href', meta.attr('content'))
            link.attr('type', meta.attr('type'))
            entry.append(link)
        }
            
        this.selector('entry:first-of-type').before(entry)
        function tagToAtom(tag) {
            return `<category term="${tag}" />`
        }
    }
}

module.exports = AtomLoader
