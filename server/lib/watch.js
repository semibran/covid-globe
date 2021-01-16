// watch.js
// recursive file watcher with debouncing
// required for linux compatibility

const fs = require('fs')
const path = require('path')

// watch(dir, cb)
// calls cb every time a file in any dir in dirs is changed
module.exports = function watch (dirs, cb) {
  let prev = 0
  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i]
    fs.watch(dir, onchange)

    // iterate through all children
    const children = fs.readdirSync(dir)
    for (const child of children) {
      const childpath = path.join(dir, child)
      // add directories to stack
      if (fs.statSync(childpath).isDirectory()) {
        dirs.push(childpath)
      }
    }
  }

  function onchange (evtype, filename) {
    const now = Date.now()
    // debounce
    if (now > prev + 200) {
      cb(evtype, filename)
    }
    prev = now
  }
}
