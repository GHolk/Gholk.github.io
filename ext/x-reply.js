function createBoard() {
    let board = document.getElementById('comment-board')
    if (!board) {
        board = document.createElement('div')
        board.id = 'comment-board'
        board.innerHTML = `
<h2>留言</h2>
<div id="disqus_thread"></div>
<menu>
<li><a href="mastodon" target="_blank">
<button>在 mastodon 或用 Activity Pub 留言</button></a></li>
<li><a href="mailto:"><button>用 email 回復</button></a></li>
<li><button id="disqus-load">載入 disqus 回復</button></li>
</menu>
<p><small>Webmention is supported</small></p>
`
        document.body.appendChild(board)
    }
    board.querySelector('a[href^=mailto]').href = getMailToUrl()
    handleActivePub(board.querySelector('a[href=mastodon]'))
}

function handleActivePub(anchor) {
    /* <link rel="alternate" href="..." type="text/html"
       name="..." id="active-pub-thread"> */
    if (!anchor) return
    const link = document.querySelector('link#activity-pub-thread')
    if (!link) return anchor.remove()
    anchor.href = link.href
}

function getMailToUrl() {
    const title = 'Re: ' + document.title
    const xx = '4b04bc44415942174ba45b4241460b64a45004fb41424a0b05f485d41b546d4b9b445e5f4b2425903b425f4a'
          .replace(/b/g, '')
          .replace(/../g, c => String.fromCharCode(45^parseInt(c, 16)))
    const url = document.location.href
    const body =
`In-Reply-To: ${url}
Is-Public: [Y/n]
---

`
    return xx + `?subject=${encodeURIComponent(title)}` +
        `&body=${encodeURIComponent(body)}`
}

if (getParameter('execute') != undefined) createBoard()
