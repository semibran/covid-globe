// parse(str[]) -> objmap{key->val}
// turns process.argv into an obj map with key dashes(--) stripped
module.exports = function parse (argv) {
  const opts = {}
  // start at argv[2] since first two args are `<node> <file>`
  for (let i = 2; i < argv.length; i += 2) {
    const key = argv[i].slice(2)
    const value = argv[i + 1]
    if (value[0] === '-') {
      // current arg is a boolean flag; set to true
      opts[key] = true
      i--
    } else {
      opts[key] = value
    }
  }
  return opts
}
