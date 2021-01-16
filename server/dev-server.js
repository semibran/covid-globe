const http = require('http')
const path = require('path')
const fs = require('fs')
const serve = require('./file-server')
const reload = require('./lib/reload')
const inject = require('./lib/inject')
const watch = require('./lib/watch')
const exec = require('./lib/exec')
const opts = require('./lib/parse-argv')(process.argv)
const dir = path.join(process.cwd(), 'public')
const htmlsrc = path.join(dir, 'index.html')
const scriptsrc = path.join(process.cwd(), 'shared', 'reload-client.js')
const script = fs.readFileSync(scriptsrc, 'utf8')
const flags = ['--watch', '--port']

module.exports = { listen, handler }

// listen(int)
// server entry point
async function listen (port) {
  // perform initial reload script injection
  // and server listening in concurrence
  return Promise.all([
    reinject(),
    (_ => new Promise(resolve => http.createServer((req, res) => {
      try {
        handler(req, res)
      } catch (err) {
        console.log(err)
      }
    }).listen(port || opts.port, _ => {
      // watch one or more directories if watch flag is provided
      // otherwise use cwd
      watchdir(opts.watch ? opts.watch.split(',') : process.cwd())
      resolve()
    })))()
  ])
}

// handler(req, res)
// resolves an http request
function handler (req, res) {
  if (req.url === '/reload') {
    reload.handler(res)
  } else {
    serve.handler(req, res)
  }
}

// watchdir(str[])
// watches one or more directories
function watchdir (dirs) {
  const onexecs = {}
  const cmds = Object.keys(opts)
    .filter(key => !flags.includes(key))

  watch(dirs, (_, filename) => {
    // command name is file ext minus dot eg. .js -> js
    const cmd = path.extname(filename).slice(1)
    if (!onexecs[cmd]) {
      // cache command to avoid func recreation per file
      onexecs[cmd] = onexec.bind(0, cmd)
    }
    // only perform command if it's not special eg.
    if (cmds.includes(cmd)) {
      exec(opts[cmd], onexecs[cmd])
    }
  })
}

// performed after every command execution
function onexec (cmd, stderr, stdout) {
  if (stderr) return console.error(stderr)
  console.log(stdout)
  if (cmd === 'html') {
    // reinject script into index if an html file has changed
    // TODO: this doesn't handle multi-page apps
    reinject().then(reload.send)
  } else if (cmd === 'css' || cmd === 'scss') {
    // css injection event if a css/scss file changes
    reload.send('reloadcss')
  } else {
    reload.send('reload')
  }
}

// reinject() -> promise
// injects the reload script into public/index.html asynchronously
function reinject () {
  return new Promise((resolve, reject) => {
    fs.readFile(htmlsrc, 'utf8', (err, html) => {
      if (err) return reject(err)
      fs.writeFile(htmlsrc, inject(script, html), (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  })
}
