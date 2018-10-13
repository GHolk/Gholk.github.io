
if (!gmeta) window.gmeta = {}

gmeta.mathJaxBlock = async function () {
    const url = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/latest.js?config=TeX-MML-AM_CHTML&delayStartupUntil=configured'
    const MathJax = await waitScriptTag(url, 'MathJax')

    for (const math of document.querySelectorAll('.lang-math')) {
        math.textContent = '\\[' + math.textContent + '\\]'
    }

    const autoLineBreak = {linebreak: {automatic: true}}
    MathJax.Hub.Config({
        CommonHTML: autoLineBreak,
        'HTML-CSS': autoLineBreak,
        SVG: autoLineBreak,
        tex2jax: {
            inlineMath: [['$','$']],
            processEscapes: true,
            skipTags: ["script","noscript","style","textarea", 'code'],
            processClass: ['lang-math']
        }
    })
    MathJax.Hub.Configured()
}

gmeta.mathJaxBlock()
