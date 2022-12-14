var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("kalibrierung", { title: "Kalibrierung" });
});

router.get("/kal-lead", function (req, res, next) {
  res.render("kal-lead", { title: "Kalibrierung" });
});

router.get("/kal-atten", function (req, res, next) {
  res.render("kal-atten", { title: "Kalibrierung" });
});

module.exports = router;
