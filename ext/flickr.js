
let flk = {}

flk.map = {}
flk.set = function (names, infos) {
    names.forEach((name, i) => {
        this.map[name] = infos[i]
    })
}
flk.getNode = function (test) {
    const map = this.map
    if (map[test]) return this.toNode(map[test])
    else {
        const matchFlickr = []
        for (let name in map) {
            if (name.match(test)) {
                if (test.global) {
                    matchFlickr.push(this.toNode(map[name]))
                }
                else return this.toNode(map[name])
            }
        }
        return matchFlickr
    }
}

flk.toNode = function (info) {
    const i = info
    const page = `https://flickr.com/photos/${i.user}/${i.photo}`
    const image =
        `https://${i.farm}.staticflickr.com/${i.server}/${i.photo}_${i.secret}.jpg`

    const a = document.createElement('a')
    a.href = page
    a.setAttribute('data-flickr-embed', true)

    const img = document.createElement('img')
    img.src = image
    a.appendChild(img)

    return a
}

flk.gn = flk.getNode

flk.script =  document.createElement('script')
flk.script.async = true
flk.script.src = 'https://embedr.flickr.com/assets/client-code.js'
flk.script.charset = 'utf-8'

window.addEventListener(
    'load',
    () => document.head.appendChild(flk.script)
)
