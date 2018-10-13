
const headerNctu = {}
headerNctu.dict = {}
headerNctu.auto = function () {
    let url = new URL(document.currentScript.src)
    this.urlParameter = url.searchParams
    if (this.urlParameter.has('execute')) this.execute()
}
headerNctu.init = function () {
    this.initDict()
    this.initHeader()
}
headerNctu.execute = function (dict) {
    this.init()
    this.replaceTemplate(dict)
    this.coverHeader()
}
headerNctu.coverHeader = function () {
    for (const selector of ['h1','p']) {
        document.querySelector(selector).remove()
    }
    document.body.prepend(this.headerElement)
}
headerNctu.initDict = function () {
    const dict = this.dict
    dict.title = document.querySelector('h1').textContent
    dict.description = document.querySelector('p').textContent
    dict.date = document.querySelector('meta[name=date]').content
    dict.keyword = document.querySelector('meta[name=keywords]').content
}
headerNctu.replaceTemplate = function (outerDict) {
    Object.assign(this.dict, outerDict)
    const header = this.headerElement
    for (const [key, value] of Object.entries(this.dict)) {
        let elements = header.getElementsByClassName(`${key}-slot`)
        if (elements.length > 0) {
            elements[0].textContent = value
        }
    }
}
headerNctu.initHeader = function () {
    let header = document.querySelector('header')
    if (!header) {
        header = document.createElement('header')
        header.innerHTML = `
<h1 class="title-slot">無題</h1>
<i class="subtitle-slot">國立交通大學</i>

<dl>
<dt>教授</dt> <dd class="professor-slot">佚名</dd>
</dl>
<dl>
<dt>作者</dt> <dd class="author-slot">gholk</dd>
</dl>
<dl>
<dt>日期</dt> <dd class="date-slot">不可考</dd>
</dl>
<dl>
<dt>關鍵字</dt> <dd class="keyword-slot">不可考</dd>
</dl>

<h2>摘要</h2>
<p class="description-slot">略</p>
`
    }
    if (this.urlParameter.has('editable')) header.contentEditable = true
    this.headerElement = header
}

headerNctu.auto()
