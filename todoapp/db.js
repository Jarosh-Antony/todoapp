

const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb://localhost:27017/todo';
const client = new MongoClient(uri, { useNewUrlParser: true });
module.exports = client;