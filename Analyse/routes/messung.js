var express = require("express");
var router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("messung", { title: "Messung" });
});



router.post("/map", function (req, res, next) {
  //let data = req.body
  console.log(req.body.OpenSenseBoxDiv);

  res.render("map", { title: "Analyse" });
});


module.exports = router;