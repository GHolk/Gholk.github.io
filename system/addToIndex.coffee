
HTMLLoader = require './FileLoaderCheerio'
IndexLoader = require './IndexLoader'

[htmlPath] = process.argv.slice(-1)
indexPath = '../index.html'

index = new IndexLoader indexPath
newPost = new HTMLLoader htmlPath

index.add newPost
index.write()


