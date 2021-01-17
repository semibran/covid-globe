const http = require('http')
const path = require('path')
const fs = require('fs')
const db = require('./db')
const queryString = require('query-string')
const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
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
async function listen (port) {
  await db.initDb((err, db) => {
    if (err) {
      console.log(err)
    }
  })
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
async function handler (req, res) {
  // prevent cors restrictions
  res.setHeader('access-control-allow-origin', '*')
  if (req.url[1] === '?') {
    // resolve request
    const data = await get(req.url)
    // console.log(data)
    if (data === undefined) {
      // undefined means data not found, so write 404
      res.writeHead(404)
      console.log('wrong!')
      res.end()
    } else {
      // otherwise, write response
      res.end(JSON.stringify(data))
    }
  } else {
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
  }
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

// query mongodb
async function get (url) {
  const location = url.slice(1)
  const parsed = queryString.parse(location)

  if (parsed.month) {
    const dateM = parsed.month

    const data = await db.getDb().collection('global').find({ date: { $regex: dateM } })
      .project({ iso_code: 1, date: 1, total_cases_per_million: 1, _id: 0 })
      .toArray()

    const dataN = normalize(data, dateM)
    return dataN
  } else if (parsed.country) {
    const country = parsed.country
    const data = await db.getDb().collection('global').find({ iso_code: country })
      .project({ _id: 0, date: 1, total_cases: 1, total_vaccinations: 1, total_deaths: 1, new_cases: 1 })
      .sort({ date: 1 })
      .toArray()
    return data
  }
}

// data normalization
function normalize (data, dateM) {
  const month = parseInt(dateM.slice(5))
  const year = parseInt(dateM.slice(0, 4))

  const dataN = []
  for (let i = 1;
    i <= (month === 2 && year % 4 === 0 ? 29 : months[month - 1]);
    i++) {
    if (i < 10) {
      dataN.push({ date: dateM + '-0' + i, countries: {} })
    } else {
      dataN.push({ date: dateM + '-' + i, countries: {} })
    }
  }

  data.forEach(element => {
    const date = element.date
    const index = dataN.indexOf(dataN.find(ele => ele.date === date))
    dataN[index].countries[element.iso_code] = element.total_cases_per_million
  })

  return dataN
}
