var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var mapRouter = require("./routes/map");
var kalibrierungRouter = require("./routes/kalibrierung");
var messungRouter = require("./routes/messung");

const app = express();
const port = 4000;

var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
app.use(jsonParser);

// Mongo DB aufsetzen
const { MongoClient } = require("mongodb");

const url = "mongodb://mongo:27017"; // connection URL

const client = new MongoClient(url); // mongodb client

const dbName = "laermmessungen"; // database name

const collectionName = "data"; // collection name

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/map", mapRouter);
app.use("/kalibrierung", kalibrierungRouter);
app.use("/messung", messungRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// rendering static files
app.use(express.static("public"));

// Path definition for the Website
app.get("/messung", (req, res) => {
  res.sendFile(path.join(__dirname, "/public", "messung.pug"));
});

// Path definition for the fetch post
app.post("/addData", function (req, res, next) {
  addData(req.body)
    .catch(console.error)
    .finally(() => client.close());
});

/**
 * Adds the data to the database
 * @param {Object} data
 */
async function addData(data) {
  await client.connect();
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  const collection = db.collection(collectionName);

  await collection.insertOne(data); //function to insert one object
  console.log("Data added successfuly");
}

module.exports = app;
