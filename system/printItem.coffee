
Loader = require './LoaderByCheerio'
fs = require 'fs'

printFileItem = (filename) ->
    whenFileRead = (err, data) ->
        throw err if err
    
        itemLoader = new Loader data
        itemLoader.filename = -> filename
        itemTags = itemLoader
            .tags()
            .split /,/g
            .map (tag) -> "<li>#{tag}</li>"
            .join '\n'
        itemLoader.tags = -> itemTags

        template = """
            <article>
            <h2><a href="{{filename}}">{{title}}</a></h2>
            <small>{{date}}</small>
            <p>
            {{description}}
            </p>
            <ul>
            {{tags}}
            </ul>
            </article>
        """

        templateNames = ['filename', 'title', 'date', 'description', 'tags']
        for templateName in templateNames
            template = template.replace(
                "{{#{templateName}}}"
                itemLoader[templateName]()
            )
        
        console.log template
        console.log '\n<hr>\n'

    fs.readFile filename, 'utf8', whenFileRead

for filename in process.argv.slice(2)
    printFileItem filename
