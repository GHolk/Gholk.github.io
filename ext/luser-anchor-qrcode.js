(function(){

function aNodeToImgNode(url) {
    var imgNode = document.createElement('img')
    imgNode.src = 
        "http://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=" + 
        encodeURIComponent(url)
    return imgNode
}

function figureAnchor(aNode) {
    var figure = document.createElement('figure')
    var figcaption = document.createElement('figcaption')
    figcaption.textContent = (
        aNode.title ||
        aNode.textContent ||
        aNode.href
    )
    figure.appendChild(aNodeToImgNode(aNode.href))
    figure.appendChild(figcaption)
    figure.className = "print-only url-qrcode"
    return figure
}

var anchors = document.getElementsByTagName('a')
for (var i=anchors.length-1; i>=0; i--) {
    anchors[i].parentNode.insertBefore(
        figureAnchor(anchors[i]),
        anchors[i]
    )
}

}())
