const HTMLLoader = require('./FileLoaderCheerio')
const AtomLoader = require('./atom-loader')

const htmlPath = process.argv.slice(-1)[0]
const atomPath = '../atom.xml'

const atom = new AtomLoader()
const post = new HTMLLoader(htmlPath)
atom.add(post)
atom.write()
