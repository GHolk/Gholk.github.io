void async function () {
    const style = document.createElement('link')
    style.rel = 'stylesheet'
    style.href = 'https://pttpedia.fandom.com/zh/index.php?title=MediaWiki:PttHighlight.css&action=raw&ctype=text/css'
    document.body.appendChild(style)

    const adjustStyle = document.createElement('style')
    adjustStyle.textContent = 'pre.ptt-format-text {padding: 0.5em;}'
    document.body.appendChild(adjustStyle)

    for (const code of document.querySelectorAll('.lang-ptt')) {
        code.textContent = code.textContent.replace(/\n$/, '')
        const block = code.parentNode
        block.classList.add('ptt-article', 'ptt-format-text', 'raw')
    }

    const pttHighlight = await waitScriptTag(
        'https://pttpedia.fandom.com/zh/index.php?title=MediaWiki:PttHighlight.js&action=raw&ctype=text/javascript&reviewed=1561492888',
        'pttHighlight'
    )
}()
