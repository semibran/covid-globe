// api-server.js

const http = require('http')
const db = require('./db')
const queryString = require('query-string')
const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

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

// query mongodb
async function get (url) {
  const location = url.slice(1)
  const parsed = queryString.parse(location)

  if (parsed.month) {
    const dateM = parsed.month

    const data = await db.getDb().collection('global').find({ date: { $regex: dateM } })
      .project({ iso_code: 1, date: 1, total_cases_per_million: 1, _id: 0 })
      .toArray()

    const dataN = normalize(data, dateM)
    return dataN
  } else if (parsed.country) {
    const country = parsed.country
    const data = await db.getDb().collection('global').find({ iso_code: country })
      .project({ _id: 0, date: 1, total_cases: 1, total_vaccinations: 1 })
      .sort({ date: 1 })
      .toArray()
    return data
  }
}

// data normalization
function normalize (data, dateM) {
  const month = parseInt(dateM.slice(5))
  const year = parseInt(dateM.slice(0, 4))

  const dataN = []
  for (let i = 1;
    i <= (month === 2 && year % 4 === 0 ? 29 : months[month - 1]);
    i++) {
    if (i < 10) {
      dataN.push({ date: dateM + '-0' + i, countries: {} })
    } else {
      dataN.push({ date: dateM + '-' + i, countries: {} })
    }
  }

  data.forEach(element => {
    const date = element.date
    const index = dataN.indexOf(dataN.find(ele => ele.date === date))
    dataN[index].countries[element.iso_code] = element.total_cases_per_million
  })

  return dataN
}
