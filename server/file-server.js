const http = require('http')
const path = require('path')
const fs = require('fs')
const root = path.join(process.cwd(), 'public')
const index = path.join(root, 'index.html')
const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
}

module.exports = { listen, handler }

// listen(uint)
// server entry point
function listen (port) {
  return new Promise(resolve => http.createServer((req, res) => {
    try {
      handler(req, res)
    } catch (err) {
      console.log(err)
    }
  }).listen(port, resolve))
}

// handler(req, res)
// handles an html request
function handler (req, res) {
  // send index if url is just root(/)
  const base = req.url === '/' ? 'index' : req.url
  let ext = path.extname(base)
  let file = path.join(root, base)
  if (ext) {
    // file extension provided, send file with 404 if error occurs
    write(res, file, 404)
  } else {
    // no extension, try and serve an html file by that name
    ext = '.html'
    file += ext
    write(res, file, null, err => {
      // file doesn't exist, send index
      // if that fails send 500 internal server error
      console.log(err, file)
      write(res, index, 500)
    })
  }

  // base headers on file extension
  res.setHeader('content-type', mime[ext || 'text/html'] || 'text/plain')

  // prevent cors restrictions
  res.setHeader('access-control-allow-origin', '*')
}

// write(res, file, errcode, errcb)
// writes a file to the given response,
// using errcode and errcb if an error occurs
function write (res, file, errcode, errcb) {
  const stream = fs.createReadStream(file)
  stream.pipe(res)
  stream.on('error', err => {
    if (errcb) return errcb(err)
    res.writeHead(errcode)
    res.end()
  })
}
