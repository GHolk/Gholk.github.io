#!/usr/bin/env node
// usage:
// node system/run-comment.js update ( $url | $html )

const process = require('process')
const libmc = require('/home/gholk/code/indie-cron/hook/mastodon-comment-system.js')
const cheerio = require('cheerio')
const fs = require('fs')

async function main(...args) {
    const mc = libmc.mc
    process.chdir('system')
    await mc.init()
    process.chdir('..')
    const res = await mc.cli(args)
    if (args[0] == 'update') {
        const b = mc.matchBoard(args[1])
        updateHtmlFile(b.name + '.html', libmc.commentFromJson(res[0]))
    }
    else console.log(res)
}

function updateHtmlFile(file, comment) {
    const h = fs.readFileSync(file, 'utf8')
    const $ = cheerio.load(h)
    const $c = $(comment)
    $('#fediverse-comment').replaceWith($c)
    fs.writeFileSync(file, $.html())
}

main(...process.argv.slice(2))
