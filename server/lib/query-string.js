// query-string.js
// encodes and decodes URL query strings
// e.g. ?foo=3&bar=42 <-> { foo: 3, bar: 42 }

module.exports = { encode, decode }

// encode(obj) -> str
// adds each of an object's keys into a query string
function encode (obj) {
  let str = ''
  let token = '?'
  for (const key in obj) {
    str += token + key + '=' + obj[key]
    token = '&'
  }
  return str
}

// decode(str) -> obj
// decodes a query string to an object
function decode (str) {
  const obj = {}
  let idx = str.indexOf('?')

  // return empty object if no ? is found
  if (idx === -1) return obj

  while (idx < str.length) {
    let eq = str.indexOf('=', idx)
    let end = str.indexOf('&', idx + 1)

    // if we don't find an ampersand,
    // just parse up to the end of the string on this iter
    if (end === -1) {
      end = str.length
    }

    let val = null
    if (eq === -1) {
      // if no equals, set value as true
      // e.g. ?foo&bar -> { foo: true, bar: true }
      eq = end
      val = true
    } else {
      // use everything up to the &/eol
      // TODO: this interprets all values as strings,
      // but we may want to parse as primitives here instead
      val = str.slice(eq + 1, end)
    }

    // the key is everything up to the equals, ignoring the ?/& char
    const key = str.slice(idx + 1, eq)

    // ignore empty keys
    if (key) obj[key] = val

    // next iter should start at &/eol
    idx = end
  }

  return obj
}
