var express = require("express");
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://127.0.0.1:27017"; // connection URL
const client = new MongoClient(url); // mongodb client
const dbName = "Lautstärkedaten"; // database name
const collectionName = "Messungen"; // collection name

/**
 * GET Befehl für die Messungen ansehen Seite
 */
router.get("/", function (req, res, next) {

  retrieveAllDatafromDB(client, dbName, collectionName, res)
  
});

// retrieve all elements from the database, and pass the results as input data
// source: https://github.com/aurioldegbelo/geosoft2022/blob/main/lecture%2009/scenario%20as%20a%20docker%20app/routes/search.js
async function retrieveAllDatafromDB(client, dbName, collectionName, res) {

  await client.connect()
  console.log('Connected successfully to the database')

  const db = client.db(dbName)
  const collection = db.collection(collectionName)

  const cursor =  collection.find({})
  const results = await cursor.toArray(function (err, docs) {
  // pass the results data as input for the search page
  res.render('show', { title: 'Messungen ansehen', data: docs });
  })
}

module.exports = router;