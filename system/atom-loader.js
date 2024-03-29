const fs = require('fs')
const cheerio = require('cheerio')

class AtomLoader {
    constructor(path) {
        if (!path) path = '../atom.xml'
        this.path = path
        const option = {
            keepNonAscii: true,
            xmlMode: true,
            normalizeWhitespace: false
        }
        this.selector = cheerio.load(fs.readFileSync(path), option)
        this.baseUri = 'http://gholk.github.io'
    }
    removeOldContent(count = 10) {
        this.selector('content').slice(10).remove()
    }
    decodeEntities(string) {
        return string.replace(
            /&#x[0-9A-F]{2,8};/g,
            e => String.fromCodePoint(parseInt(e.slice(3, -1), 16))
        )
    }
    write() {
        const current = new Date()
        this.selector('feed > updated:first-of-type')
            .text(current.toISOString())
        this.removeOldContent()
        fs.writeFileSync(
            this.path,
            this.decodeEntities(this.selector.html()),
            'utf8'
        )
    }
    add(loader) {
        const entry = this.createEntry(loader)
        const tags = loader.tags.split(/,/g)
        if (!tags.includes('hide')) {
            if (tags.includes('sage')) {
                this.selector('entry:nth-of-type(9)').after(entry)
            }
            else {
                this.selector('entry:first-of-type').before(entry)
            }
        }
    }
    createEntry(loader) {
        const tags = loader.tags.split(/,/g).map(tagToAtom).join('\n')
        const currentDate = new Date()
        const entry = this.selector('<entry>')
        entry.html(`
<id>${this.baseUri}/${loader.file}</id>
<title>${loader.title}</title>
<published>${loader.date}</published>
<updated>${currentDate.toISOString()}</updated>
<link rel="alternate" type="text/html"
      href="${this.baseUri}/${loader.file}" />
<summary type="html"></summary>
${tags}
<content type="html"></content>
`)
        entry.find('summary').text(loader.description)
        entry.find('content').text(loader.main)
        const $ = loader.selector
        $('meta[property]')
            .filter(
                (i, meta) => /^og:.*:url$/.test($(meta).attr('property'))
            )
            .each((i, meta) => {
                const $meta = $(meta)
                const $link = this.selector('<link>')
                $link.attr('rel', 'enclosure')
                $link.attr('href', $meta.attr('content'))
                entry.find('summary').after($link)
            })

        return entry

        function tagToAtom(tag) {
            return `<category term="${tag}" />`
        }
        function escapeHtml(html) {
            return html.replace(/&/g, '&amp;')
                .replace(/>/g, '&gt;')
                .replace(/</g, '&lt;')
        }
    }
}

module.exports = AtomLoader
