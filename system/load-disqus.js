let disqus_config = function () {
    this.page.url = window.location
    this.page.identifier = window.location.toString().replace(/.*\//,'')
}

void function() {
    const loadButton = document.querySelector('#disqus_thread button')
    loadButton.addEventListener(
        'click',
        function loadButtonClick() {
            this.remove()
            void function () {
                const d = document
                const s = d.createElement('script')
                s.src = 'https://gholk-gh.disqus.com/embed.js'
                s.setAttribute('data-timestamp', Number(new Date()))
                d.body.appendChild(s)
            }()
        },
        {once: true}
    )
}()
