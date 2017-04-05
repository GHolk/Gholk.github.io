
fs = require 'fs'
cheerio = require 'cheerio'

class IndexLoader
    constructor: (path) ->
        @path = path
        @selector = cheerio.load (fs.readFileSync path, 'utf8'), {
            decodeEntities: false
            xmlMode: false
            withDomLvl1: true
            normalizeWhitespace: false
        }

    add: (loader) ->
        tagsArray = loader.tags.split /,/g
        wrapTag = (tag) -> """
            <li><a href="index.html?tags=#{tag}">#{tag}</a></li>
        """
        if tagsArray.some((tag) -> tag == 'hide')
            return 'hide post.'

        @selector("""
            <article>
                <h2><a href="#{loader.file}">#{loader.title}</a></h2>
                <small class="date">#{loader.date}</small>
                <p>
                #{loader.description}
                </p>
                <ul class="tag-list">
                #{tagsArray.map(wrapTag).join('\n')}
                </ul>
            </atricle>
            <hr>
        """).insertAfter 'h1'

    write: (path = @path) ->
        fs.writeFileSync path, @selector.html(), 'utf8'

module.exports = IndexLoader
