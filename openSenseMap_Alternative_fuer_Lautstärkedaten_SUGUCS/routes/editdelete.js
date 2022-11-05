var express = require("express");
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;

var mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const axios = require("axios");

const url = "mongodb://127.0.0.1:27017"; // connection URL
const client = new MongoClient(url); // mongodb client
const dbName = "Lautstärkedaten"; // database name
const collectionName = "Messungen"; // collection name


/**
 * GET Befehl für die Messungen bearbeiten Seite
 */
router.get("/", function (req, res, next) {
  retrieveAllDatafromDB(client, dbName, collectionName, res)
});

// retrieve all elements from the database, and pass the results as input data
// source: https://github.com/aurioldegbelo/geosoft2022/blob/main/lecture%2009/scenario%20as%20a%20docker%20app/routes/search.js
async function retrieveAllDatafromDB(client, dbName, collectionName, res) 
{

  await client.connect()
  console.log('Connected successfully to the database')

  const db = client.db(dbName)
  const collection = db.collection(collectionName)

  const cursor =  collection.find({})
  const results = await cursor.toArray(function (err, docs) {
  // pass the results data as input for the edit
  res.render('editdelete', { title: 'Messungen bearbeiten', data: docs });

})
}

// Ausgewählte Messungen löschen
router.post("/deleteOne", function (req, res, next) {

  var id = req.body.id;

  // Überprüft ob Messungen ausgewält wurde
  if (id == "") {
    res.render("notification", {
      title: "Kein Messungen ausgewählt!",
    });
  } else {
    deleteDatafromDB(req, client, dbName, collectionName, res)
  }
});

router.post("/updateOne", function (req, res, next) {

  var id = req.body.id;

  // Überprüft ob Messungen ausgewält wurde
  if (id == "") {
    res.render("notification", {
      title: "Kein Messungen ausgewählt!",
    });
  } else {
    updateDatafromDB(req, client, dbName, collectionName, res)
  }
});

// source: https://www.mongodbtutorial.org/mongodb-crud/mongodb-deleteone/
async function deleteDatafromDB(req, client, dbName, collectionName, res) {

  await client.connect()
  console.log('Connected successfully to the database')
  
  const db = client.db(dbName)
  const collection = db.collection(collectionName)

  var id = req.body.id;

  const cursor =  collection.find({ _id: ObjectId(id) })
  const results = await cursor.toArray(function (err, docs) {
    if (docs.length >= 1) {
      collection.deleteOne({ _id: ObjectId(id) }, function (err, results) {
      });
      res.render("notification", {
        title: "Messung erfolgreich gelöscht!",
      });
    } 
  })
}

// update selected elements from the database
async function updateDatafromDB(req, client, dbName, collectionName, res) 
{

  await client.connect()
  console.log('Connected successfully to the database')
  
  const db = client.db(dbName)
  const collection = db.collection(collectionName)

  var id = req.body.id;

  collection.find({ _id: new ObjectId(id) }).toArray(function (err, docs) {
    if (docs.length >= 1) {
      //if the locations exists and is not in use
      collection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            properties: {
              name: req.body.name,
              time: req.body.time,
              timespan: req.body.timespan,
              fre: req.body.fre,
              react: req.body.react,
              leq: req.body.leq,
              lmin: req.body.lmin,
              lmax: req.body.lmax,
              lpeak: req.body.lpeak,
            },
            geometry: {
              coordinates: [req.body.long, req.body.lat],
            },
          },
        },
        { upsert: true }
      );
      res.render("notification", {
        title: "Messung erfolgreich bearbeitet!"
      });
    } else {
      //if the location does not exist
      res.send("Keine Messung gefunden?!");
      return;
    }
  });
}

module.exports = router;
