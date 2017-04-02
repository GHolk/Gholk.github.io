
HTMLLoader = require './FileLoaderCheerio'

updateRel = (oldLoader, rel, newLoader) ->
    oldLoader[rel] = newLoader.file
    oldLoader["#{rel}Title"] = newLoader.title
    oldLoader.sync()
    oldLoader.write()

newHTML = new HTMLLoader process.argv.slice(-1)[0]

prevHTML = new HTMLLoader newHTML.prev
updateRel prevHTML, 'next', newHTML

templateHTML = new HTMLLoader 'template.html'
updateRel templateHTML, 'prev', newHTML


