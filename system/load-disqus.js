var disqus_config = function () {
    this.page.url = window.location
    this.page.identifier = window.location.toString().replace(/.*\//,'')
}

void function() {
    var d = document
    var s = d.createElement('script')
    s.src = 'https://gholk-gh.disqus.com/embed.js'
    s.setAttribute('data-timestamp', Number(new Date()))
    d.body.appendChild(s)
}()
