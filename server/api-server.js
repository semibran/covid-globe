// api-server.js

const http = require('http')
const { callbackify } = require('util')
const db = require('./db')

module.exports = { listen, handler }

// listen(port: int)
// create server and listen on port
async function listen (port) {
  await db.initDb((err, db) => {
    if (err) {
      console.log(err) }
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
  const data = get(req.url)
  console.log(123)
  if (data === undefined) {
    // undefined means data not found, so write 404
    res.writeHead(404)
    res.end()
  } else {
    // otherwise, write response
    res.end(JSON.stringify(data))
  }
}

async function get (url) {
  db.getDb().collection('test').find().toArray()
  .then(result => {
    console.log(JSON.stringify(result))
    return result
  })


  //  db.getDb().collection('global').find({ date: '2020-02-24' }).toArray()
  // .then(result => {
  //   console.log(result)
  // })
}
