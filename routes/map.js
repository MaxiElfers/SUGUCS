var express = require("express");
var router = express.Router();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

/*var SID = document.getElementById("sid").value;
var starttime = document.getElementById("starttimeInput").value;
var endtime = document.getElementById("endtimeInput").value;
var SBID = document.getElementById("userInput").value;
*/

/* GET users listing. */
router.get("/", function (req, res, next) {

    res.render("map", {
        title: "Karte",
        weblink: "http://127.0.0.1:8000/structurePlot?boxID=60f077874fb91e001c71b3b1&from=2022-11-22T08%3A00%3A00Z&to=2022-11-23T08%3A00%3A00Z&Day=FALSE&Night=TRUE&MA=TRUE&Mean=TRUE&colors=1&theme=1",
    });
});


module.exports = router;
