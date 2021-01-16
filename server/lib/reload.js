// reload-server.js
// live reload server

const crypto = require('crypto')
const clients = {}

module.exports = { handler, send }

// handler(res)
// handles an http request
// data from request is unused
function handler (res) {
  // prevent connection timeouts
  const heartbeat = setInterval(_ => res.write(':\n\n'), 90000)

  // assign random identifier to this client
  const id = crypto.randomBytes(6).toString('hex')
  clients[id] = res

  // send connection event
  res.setHeader('content-type', 'text/event-stream')
  res.write('data:connect\n\n')

  // clear once client closes connection
  res.on('abort', _ => {
    clearInterval(heartbeat)
    delete clients[id]
  })
}

// send(str)
// send data to all clients
function send (msg = 'reload') {
  for (const key in clients) {
    clients[key].write('data:' + msg + '\n\n')
  }
}
