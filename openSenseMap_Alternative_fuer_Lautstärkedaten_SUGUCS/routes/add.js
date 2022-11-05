var express = require("express");
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;

const gjv = require("geojson-validation");
const axios = require("axios");

const url = "mongodb://127.0.0.1:27017"; // connection URL
const client = new MongoClient(url); // mongodb client
// beim hinzufügen mit leaflet draw gibt es schon mal das Problem, dass nach einer Weile keine Koordinaten mehr in die Datenbank hinzugefügt werden. Ist dies der Fall,
// kann es zu Problemen bei der Ansicht auf der "Messungen bearbeiten" und "Messungen ansehen" Seite und deren Leaflet Karten kommen. 
// Ist dies der Fall bitte hier und in "show.js", "edit.js" und "routing.js" eine andere Datenbank wählen!
const dbName = "Lautstärkedaten"; // database name
const collectionName = "Messungen"; // collection name


/**
 * GET Befehl für die Messungen hinzufügen Seite
 */
router.get("/", function (req, res, next) {
  res.render("add", { title: "Messungen hinzufügen" });
});

/**
 * POST Befehl für die durch leafletdraw hinzugefügten Messungen
 */
router.post("/leafletmarker", function (req, res, next) {

  // Überprüfung auf Korrektheit der Eingaben welche mindestens Angegeben werden müssen, um eine Messung hinzuzufügen
  if (req.body.messung == "" || req.body.name == "" || req.body.time == "" || req.body.timespan == "" || req.body.long == "" || req.body.lat == "" || req.body.fre == "" || req.body.react == "" || req.body.leq == "") {
    res.render("notification", {
      title: "Falsche Eingabe! Bitte überarbeiten und noch mal versuchen!",
    });
  } else {

    // Hier wird mit einem Timeout gearbeitet, da erst die Beschreibung da sein soll!
      setTimeout(function () {
      // Definieren des Features
      let messung = {
        "type": "Feature",
        "properties": {
          "shape": "Marker",
          "name": req.body.name,
          "time": req.body.time,
          "timespan": req.body.timespan,
          "fre": req.body.fre,
          "react": req.body.react,
          "leq": req.body.leq,
          "lmin": req.body.lmin,
          "lmax": req.body.lmax,
          "lpeak": req.body.lpeak
        },
        "geometry": {
          "type": "Point",
          "coordinates": [req.body.long, req.body.lat]
        },
      };
      addNewDatatoDB(client, dbName, collectionName, messung, res);
    }, 1500);
  }
});

/**
 * POST Befehl für einen durch das Eingabefeld vom Nutzer hinzugefügtes Messungen in GeoJSON Format als Text
 */
router.post("/textarea", function (req, res, next) {

  try {
    JSON.parse(req.body.textarea);
  }
  catch (err) {
    res.render("notification", {
      title: "Falsche Eingabe! Bitte nur einzelne Features, keine FeatureCollections!",
    });
  }
  let messung = JSON.parse(req.body.textarea);

    // Hier wird mit Timeout gearbeitet, damit die Beschreibung gegeben ist
    setTimeout(function () {

      addNewDatatoDB(client, dbName, collectionName, messung, res);
    }, 1500);
});


/**
 * addNewDatatoDB
 * @description retrieve all elements from the database, and pass the results as input data
 * @param {*} client 
 * @param {*} dbName 
 * @param {*} collectionName 
 * @param {*} messung 
 * @param {*} res 
 * @source: https://github.com/aurioldegbelo/geosoft2022/blob/main/lecture%2008/scenario%20(express%20%2B%20mongodb)/routes/add.js
 */
 function addNewDatatoDB(client, dbName, collectionName, messung, res) 
 {
   client.connect(function (err) {
     console.log("Connected successfully to server");
 
     // abrufen der DB und ihrerer Kollektion
     const db = client.db(dbName);
     const collection = db.collection(collectionName);
 
     // Einfügen in die Datenbank
     collection.insertOne(messung) // see https://www.mongodb.com/docs/drivers/node/current/usage-examples/insertOne/
     console.log("New Data inserted in the database");
     res.render("notification", { title: "Messungen hinzugefügt!", data: JSON.stringify(messung) });
   });
 }

module.exports = router;