let disqus_config = function () {
    this.page.url = window.location.toString()
    this.page.identifier = window.location.toString().replace(/.*\//,'')
}

let disqus_thread = document.querySelector('#disqus_thread')
if (!disqus_thread) {
    disqus_thread = document.createElement('div')
    disqus_thread.id = 'disqus_thread'
    document.body.appendChild(disqus_thread)
}

function loadDisqus() {
    const d = document
    const s = d.createElement('script')
    s.src = 'https://gholk-gh.disqus.com/embed.js'
    s.setAttribute('data-timestamp', Number(new Date()))
    d.body.appendChild(s)
}

function lazyDisqus() {
    const details = document.createElement('details')
    details.innerHTML = '<summary>留言板</summary>'
    details.appendChild(disqus_thread)
    details.ontoggle = function () {
        loadDisqus()
        this.ontoggle = null
    }
    document.body.appendChild(details)
}

function testLoadDisqus() {
    const lazy = getParameter('lazy')
    const disqus = getParameter('disqus')
    if (lazy === '') lazyDisqus()
    else if (disqus === undefined ||
             disqus === '' ||
             disqus === 'true' ||
             disqus === '1') {
        loadDisqus()
    }
}

testLoadDisqus()
