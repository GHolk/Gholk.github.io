
HTMLLoader = require './FileLoaderCheerio'
TextLoader = require './FileLoaderText'

filePath = do ->
    [html] = process.argv.slice(-1)
    text = html.replace('../','../text/').replace('.html','.txt')
    return {text,html}

textLoader = new TextLoader filePath.text
htmlLoader = new HTMLLoader filePath.html

if ! htmlLoader.date
    htmlLoader.date = (new Date()).toISOString()

htmlLoader.update textLoader
htmlLoader.sync()
htmlLoader.write()

