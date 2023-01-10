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

router.get("/XL2", function (req, res, next){
  const { SerialPort } = require('serialport');
 var port = "COM3";
 let dbArray = [];
 let soundArray = [];

    var serialPort = new SerialPort({
        path: port,
        baudRate: 9600, 
      });
      
      serialPort.on("open", function() {
        console.log("-- Connection opened --");
        serialPort.write('*RST\n') 
        serialPort.write('INIT START\n')
        for(var i = 0; i < 1000; i++){
          serialPort.write('MEAS:INIT\n')
          serialPort.write('MEAS:SLM:123?LAF\n')
          serialPort.write('INIT STOP\n')
        }
        serialPort.on("data", function(data) {
          console.log("Data received: " + data);
          dbArray.push("Data received: " + data);
        });
        setTimeout(function(){
          sounddatenBearbeiten();
          serialPort.close()
        }, 11000)
      });


  /**
 * builds the soundArray, so there are 
 * only a db number for every secound 
 */
  function sounddatenBearbeiten(){
  var counter = 0;
  for(var i = 0; i< dbArray.length; i++){
    soundArray[counter] = (parseFloat(dbArray[i].slice(15, 19)) +4);
    i += 99;
    counter++;
  }
  console.log(soundArray);
  res.render("kal-lead", {titel: "Kalibrierung", array: soundArray})
  }
})

module.exports = router;
