
// call in inline script, return the script tag itself.
function thisPrevNode(selector) {
    const allMatch = document.querySelectorAll(selector)
    const lastMatch = allMatch[allMatch.length - 1]
    return lastMatch
}

// change `:this` to the style id itself
function changeStyleThis(style) {
    let id
    if (style.id) id = style.id
    else {
        const float = Math.random()
        id = 'random-' + String(float).slice(2)
        style.id = id
    }

    style.textContent =
        style.textContent.replace(/:this\b/g, `#${id}`)
}

window.addEventListener('load', () => {
    let allStyle = document.querySelectorAll('style')
    Array.from(allStyle).forEach(changeStyleThis)
})
