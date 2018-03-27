'use strict'

if (navigator.serviceWorker) {
    navigator.serviceWorker.register('service-worker.js')
}
else void function () {

class Calendar {
    constructor() {
        this.alerm = []
        this.interval = 1 * 60 * 1000
    }
    add(alerm) {
        this.alerm.push(alerm)
    }
    expire(date) {
        const expireAlerm = []
        const elseAlerm = []
        this.alerm.forEach(alerm => {
            if (alerm.date > date) elseAlerm.push(alerm)
            else expireAlerm.push(alerm)
        })
        this.alerm = elseAlerm
        return expireAlerm
    }
    notify(alerm) {
        this.showNotify(alerm.title, alerm.body)
    }
    expireNotify() {
        const now = new Date()
        const expireAlerm = this.expire(now)
        expireAlerm.forEach(alerm => this.notify(alerm))
    }
    addFromForm(form) {
        const alerm = {}
        alerm.date = new Date(alerm.get('date'))
        alerm.title = alerm.get('title')
        alerm.body = alerm.get('body')
        this.add(alerm)
    }
}

function showNotify(title, body) {
    return self.registration.showNotification(title, {body})
}

const calendar = new Calendar()
calendar.showNotify = showNotify

self.addEventListener('fetch', (fetchEvent) => {
    const request = fetchEvent.request
    if (request.method == 'POST' &&
        request.url.match(/alerm\/new$/)) {
        request.formData().then(form => calendar.addFromForm(form))
        const done = stringToResponse('done')
        fetchEvent.respondWith(done)
    }
})


void function keepAlerm() {
    calendar.expireNotify()
    setTimeout(keepAlerm, calendar.interval)
}()

function stringToResponse(string) {
    const headers = new Headers()
    headers.append('Content-Type', 'text/plain')
    const response = new Response(string, {headers})
    return response
}

}()
