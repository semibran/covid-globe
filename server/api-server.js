// api-server.js

const http = require('http')
const db = require('./db')

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
  console.log(data)
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
  const data = await db.getDb().collection('global').find({ date: '2020-03-24' }).toArray()
  console.log(JSON.stringify(data))
  return data
}
