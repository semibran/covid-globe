const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient

const mongoDbUrl = 'mongodb+srv://ning:vDeS2UfYFwymOuVa@htn.uttoz.mongodb.net/covid?retryWrites=true&w=majority'

let _db

const initDb = callback => {
  if (_db) {
    console.log('Database is already initialized!')
    return callback(null, _db)
  }
  MongoClient.connect(mongoDbUrl)
    .then(client => {
      console.log('Database initialized!')
      _db = client.db()
      callback(null, _db)
    })
    .catch(err => {
      callback(err)
    })
}

const getDb = () => {
  if (!_db) {
    throw Error('Database not initialzed')
  }
  return _db
}

module.exports = {
  initDb,
  getDb
}
