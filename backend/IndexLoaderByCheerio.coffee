cheerio = require 'cheerio'
fs = require 'fs'

class IndexLoaderByCheerio
    constructor: (path) ->
        @path = path
        @selector = cheerio.load fs.readFileSync path

    write: ->
        fs.writeFileSync @path, @selector.html(), 'utf8'

    add: (loader) ->
        tagsHTML = loader.tags()
            .split /,/g
            .map (t) -> "<li>#{t}</li>"
            .join '\n'
        tagsHTML = "<ul>\n#{tagsHTML}\n</ul>"

        html = """
            <article>
                <h2><a href="#{loader.path()}">#{loader.title()}</a></h2>
                <small class="date">#{loader.date()}</small>
                <p>
                #{loader.description()}
                </p>
                #{tagsHTML}
            </article>
        """
        @selector(html + "\n<hr>\n").insertAfter('h1')

    clear: ->
        $h1 = @selector 'h1'
        $body = @selector 'body'
        $body.empty()
        $body.append $h1

module.exports = IndexLoaderByCheerio
