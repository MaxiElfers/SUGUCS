var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
    res.render("map", {
        title: "Karte",
        ueblink: "http://localhost:8000/linearRegression",
        weblink: "http://localhost:8000/Scatter"
    });
});

module.exports = router;
