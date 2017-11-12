
var filenameList = [
    './malice-world-fact-mind.txt',
    './engineer-linear-logic.txt',
    './suck-ui-design-long-code.txt',
    './cosine-beauty.txt',
    './cold-shower-suspend.txt',
    './forgive-for-nothing.txt',
    './suck-government-website-computer.txt',
    './man-pain-for-woman.txt',
    './my-girlfriend-in-multiverse.txt',
    './believe-so-exist.txt',
    './github-cname-twbbs.txt',
    './name-after-no-sense.txt',
    './calture-gap-darrenshan.txt',
    './soul-knight-joystick.txt',
    './seek-kind-of-forever.txt',
    './library-noise-by-staff.txt',
    './t-short-sleeve-armpit-hair.txt',
    './game-passion-maintain.txt',
    './widow-for-future.txt',
    './giveup-mature.txt',
    './unbalance-hair-style.txt',
    './js-object-new-prototype.txt',
    './lost-love-lost-life.txt',
    './#poland-expression-bash-lisp.txt#',
    './poland-expression-bash-lisp.txt',
    './namewee-taiwan-think-hometown.txt',
    './coffee-javascript-or-what.txt',
    './call-female-right.txt',
    './hometown-change.txt',
    './the-great-proud-architect.txt',
    './sad-manipulate.txt',
    './modern-gender-interact.txt',
    './low-dependent-map-js.txt',
    './do-my-best-enough-responsibility.txt',
    './practice-matrix-object-javascript.txt',
    './avalon-questionnaire-prize.txt',
    './easy-m-expression-syntax.txt',
    './expect-big-liar-what.txt',
    './angry-childish.txt',
    './wansei-tendrum.txt',
    './golden-age-in-university.txt',
    './baidu-translate-evil.txt',
    './scadual-105-2.txt',
    './one-piece-hunter-speed.txt',
    './twbbs-dinshin.txt',
    './virtual-joystick-suck.txt',
    './how-friend.txt',
    './sing-out-sad.txt',
    './black-sky-no-forget.txt',
    './lazy-tor-firefox-socks5.txt',
    './vector-fighter-intro.txt',
    './cosine-friend.txt',
    './taiwoman.txt',
    './worship-greater-love.txt',
    './emacs-screen-tmux.txt',
    './ptt-network-bully-gossiping.txt',
    './open-sex-love-rape.txt',
    './half-month-so-lot-first.txt',
    './book-and-so-on.txt',
    './iife-js-void-semicolon.txt',
    './into-javascript-trend.txt',
    './color-direction-language.txt',
    './rule-your-game.txt',
    './riot-politician.txt',
    './motorcycle-suck.org',
    './wukoung-novel.txt',
    './fluent-novel-text.txt',
    './magician-honer.txt'
]

function readFile(path) {
    return new Promise((responseFile, responseError) => {
        fs.readFile(path, 'utf8', (readError, file) => {
            if (readError) responseError(readError)
            else responseFile(file)
        })
    })
}

console.time('promise-all')
Promise.all(
    filenameList.map(path => readFile(path))
).then(
    function (allFile) {
        exports.allFile = allFile
        console.timeEnd('promise-all')
    },
    function (readError) {
        exports.fileError = readError
        console.timeEnd('promise-all')
    }
)
