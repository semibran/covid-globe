const fileserver = require('./file-server')
const devserver = require('./dev-server')
const apiserver = require('./api-server')
const opts = require('./lib/parse-argv')(process.argv)
const port = (opts.port || 3000)
const url = 'http://localhost:' + port
const prod = process.env.NODE_ENV === 'production'

// use either dev server or simple file server,
// depending on NODE_ENV var
// always start api server
Promise.all([
  (prod ? fileserver : devserver).listen(port),
  apiserver.listen(port + 1)
]).then(_ => console.log('Running at', url))
