var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("kalibrierung", { title: "Kalibrierung" });
});

router.get("/group-lead", function (req, res, next) {
  res.render("kal-group-lead", { title: "Kalibrierung" });
});

router.get("/group", function (req, res, next) {
  res.render("kal-group", { title: "Kalibrierung" });
});

module.exports = router;
