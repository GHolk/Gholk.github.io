

class Escadual {
    constructor(events) {
        if (!events) {
            if (localStorage.hasOwnProperty('escadual-events')) {
                events = JSON.parse(localStorage['escadual-events'])
            }
            else events = []
        }
        this.events = events
        this.date = new Date()
    }
    addFromForm(form = document.querySelector('#add-event')) {
        const formData = new FormData(form)
        const event = {}
        for (const [key, value] of formData) {
            event[key] = value
        }
        this.events.push(event)
    }
    save() {
        localStorage['escadual-events'] = JSON.stringify(this.events)
    }
    check(event, date = this.date) {
        switch (event.type) {
        case 'once':
            return this.checkOnce(event, date)
        case 'week':
            return this.checkWeek(event, date)
        default:
            throw new Error('unkown event type')
        }
    }
    checkWeek(event, date) {
        return event.day == date.getDay() &&
            new Date(event.date) > date
    }
    checkOnce(event, date) {
        const eventDate = new Date(event.date)
        return Math.abs(eventDate - date) < 24 * 60 * 60 * 1000
    }
    match(date) {
        return this.events.filter(event => this.check(event, date))
    }
    showDate(date) {
        const events = this.match(date)
        this.showEvents(events)
    }
    showEvents(events) {
        return events
    }
    eventToHtml(event) {
        let date
        if (event.type == 'week') {
            if (event.day == 0) date = '周日'
            else date = `周${event.day}`
        }
        else date = event.date
        return `
<div class="escadual-event">
<h2>${event.title}</h2>
<small>${date}</small>
<p>${event.body}</p>
</div>`
    }
}

var escadual = new Escadual()
escadual.showEvents = function (events) {
    const html = events.map(this.eventToHtml).join('\n')
    const eventBoard = document.querySelector('#event-board')
    eventBoard.innerHTML = html
}

injectHtml()

function injectHtml() {
    const div = document.createElement('div')
    let html = ''
    html += `<form 
    id="add-event"
    onsubmit="escadual.addFromForm(); return false">
  <label class="inline">
    <input type="radio" name="type" value="once" checked> 一次性</label>
  <label class="inline">
    <input type="radio" name="type" value="week"> 每周</label>
  <label> 日期
    <input type="date" name="date">
  </label>
  <label> 星期
    <select name="day">
        <option value="1">周一</option>
        <option value="2">周二</option>
        <option value="3">周三</option>
        <option value="4">周四</option>
        <option value="5">周五</option>
        <option value="6">周六</option>
        <option value="0">周日</option>
    </select>
  </label>
  <label> 標題
    <input type="text" name="title">
  </label>
  <label> 詳細說明
  <textarea name="body"></textarea>
  </label>
  <input type="submit" value="新增事件">
  <button onclick="escadual.save()" type="button">儲存</button>
</form>`
    html += `<div id="event-board"></div>`
    html += `<link rel="stylesheet" href="ext/escadual.css">`
    div.innerHTML = html
    document.body.appendChild(div)
}

