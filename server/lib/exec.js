const cprocess = require('child_process')

// exec(cmd)
// performs the given shell command, then calls cb with stderr and stdout
module.exports = function exec (cmd, cb) {
  let stderr = ''
  let stdout = ''
  const proc = cprocess.exec(cmd, err => err && console.log)
  proc.stderr.on('data', data => { stderr += data })
  proc.stdout.on('data', data => { stdout += data })
  proc.on('close', _ => cb(stderr, stdout))
}
