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

if (!goption.hasOwnProperty('disqus') || eval(goption.disqus)) loadDisqus()

