// api-server.js

const http = require('http')
const db = require('./db')
const queryString = require('query-string')

module.exports = { listen, handler }

// listen(port: int)
// create server and listen on port
async function listen (port) {
  await db.initDb((err, db) => {
    if (err) {
      console.log(err)
    }
  })

  await new Promise(resolve => http.createServer(async (req, res) => {
    try {
      handler(req, res)
    } catch (err) {
      console.log(err)
    }
  }).listen(port, resolve))
}

// handler(req: http.ClientRequest, res: http.ServerResponse)
// handles a client request
async function handler (req, res) {
  // prevent cors errors (insecure, but ok for small projects)
  res.setHeader('access-control-allow-origin', '*')

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
}

async function get (url) {
  const location = url.slice(1)
  console.log(location)
  const parsed = queryString.parse(location)
  console.log(parsed)

  if (parsed.month) {
    const month = parsed.month
    const data = await db.getDb().collection('global').find({ date: { $regex: month } })
      .project({ iso_code: 1, total_cases: 1 })
      .toArray()
    // console.log(JSON.stringify(data))
    return data
  } else if (parsed.country) {
    const country = parsed.country
    const data = await db.getDb().collection('global').find({ iso_code: country }).toArray()
    // console.log(JSON.stringify(data))
    return data
  }
}
