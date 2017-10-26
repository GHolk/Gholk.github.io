let disqus_config = function () {
    this.page.url = window.location.toString()
    this.page.identifier = window.location.toString().replace(/.*\//,'')
}

void function() {
    const d = document
    const s = d.createElement('script')
    s.src = 'https://gholk-gh.disqus.com/embed.js'
    s.setAttribute('data-timestamp', Number(new Date()))
    d.body.appendChild(s)
}()
