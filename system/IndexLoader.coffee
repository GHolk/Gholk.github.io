
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
            <li><a href="?tags=#{tag}">#{tag}</a></li>
        """

        @selector 'main'
            .prepend 'hr'
            .prepend """
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
            """

    write: (path = @path) ->
        fs.writeFileSync path, @selector.html(), 'utf8'

module.exports = IndexLoader
