var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {

    res.render("map", {
        title: "Karte"
    });
});

router.post("/", function(req, res, next) {

    sid = req.body.sbidinput
    start = req.body.startInput
    end = req.body.endInput

    console.log(sid)
    console.log(start)
    console.log(end)

    res.render("map", {
        title: "Karte",
        weblink: `http://127.0.0.1:8000/structurePlot?boxID=${sid}&from=${start}:00Z&to=${end}:00Z&Day=TRUE&Night=TRUE&MA=TRUE&Mean=TRUE&colors=1&theme=1`,
    });
});

module.exports = router;