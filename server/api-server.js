// api-server.js

const http = require('http')
const mongodb = require('mongodb').MongoClient

module.exports = { listen, handler }

// listen(port: int)
// create server and listen on port
function listen (port) {
  return new Promise(resolve => http.createServer((req, res) => {
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
}

function get (url) {
  // resolve url request
}

mongodb.connect('mongodb+srv://ning:hackcovid@htn.uttoz.mongodb.net/covid?retryWrites=true&w=majority')
  .then(client => {
    console.log('Connected!')
  })
  .catch(err => {
    console.log(err)
  })
