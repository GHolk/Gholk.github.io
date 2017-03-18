
Loader = require './LoaderByCheerio'
fs = require 'fs'

printFileItem = (filename) ->
    whenFileRead = (err, data) ->
        throw err if err
    
        itemLoader = new Loader data
        itemLoader.filename = -> filename
        
        template = """
            <h2><a href="{{filename}}">{{title}}</a></h2>
            <small>{{date}}</small>
            <p>
            {{description}}
            </p>
        """
        
        for templateName in ['filename', 'title', 'date', 'description']
            template = template.replace(
                "{{#{templateName}}}"
                itemLoader[templateName]()
            )
        
        console.log template

    fs.readFile filename, 'utf8', whenFileRead

for filename in process.argv.slice(2)
    printFileItem filename
