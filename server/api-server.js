// api-server.js

const http = require('http')
const db = require('./db')

module.exports = { listen, handler }

// listen(port: int)
// create server and listen on port
async function listen (port) {
  db.initDb((err, db) => {
    if (err) {
      console.log(err) }
  })

  await new Promise(resolve => http.createServer((req, res) => {
    try {
      handler(req, res)
    } catch (err) {
      console.log(err)
    }
  }).listen(port, resolve))
}

// handler(req: http.ClientRequest, res: http.ServerResponse)
// handles a client request
function handler (req, res) {
  // prevent cors errors (insecure, but ok for small projects)
  res.setHeader('access-control-allow-origin', '*')

  // resolve request
  const data = get(req.url)

  if (data === undefined) {
    // undefined means data not found, so write 404
    res.writeHead(404)
    res.end()
  } else {
    // otherwise, write response
    res.end(JSON.stringify(data))
  }

  console.log('test')
}

function get (url) {
  return db.getDb().collection('global').find({ _id:'60026130c62825041a9ae851' })
}
