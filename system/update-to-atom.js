const HTMLLoader = require('./FileLoaderCheerio')
const AtomLoader = require('./atom-loader')

const htmlPath = process.argv[2]
const changeLog = process.argv[3].trim().split(/\n/g)

const atom = new AtomLoader()
const post = new HTMLLoader(htmlPath)

function addToAtom(title, description) {
    post.description = description
    post.file += '#' + title
    atom.add(post)
    atom.write()
}

function extractDiffFromGit(gitLog) {
    const logList = gitLog.split(/\n/g)
    const contentStart = /^@@/
    while (!contentStart.test(logList[0])) logList.shift()
    return logList.join('\n')
}

const changeTitle = changeLog[0].replace(/\s/g, '-')
if (changeLog.length > 1) {
    const changeDescription = changeLog.slice(1).join('\n')
    addToAtom(changeTitle, changeDescription)
}
else {
    let gitLog = ''
    process.stdin.on('data', data => gitLog += data)
    process.stdin.on('end', () => {
        const changeDescription = extractDiffFromGit(gitLog)
        addToAtom(changeTitle, changeDescription)
    })
}
