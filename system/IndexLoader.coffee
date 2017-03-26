
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
        @selector("""
            <article>
                <h2><a href="#{loader.file}">#{loader.title}</a></h2>
                <small class="date">#{loader.date}</small>
                <p>
                #{loader.description}
                </p>
                <ul>
                <li>#{loader.tags.replace /,/g, "</li>\n<li>"}</li>
                </ul>
            </atricle>
        """).insertAfter 'h1'

    write: (path = @path) ->
        fs.writeFileSync path, @selector.html(), 'utf8'

module.exports = IndexLoader
