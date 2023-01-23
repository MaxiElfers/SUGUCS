var express = require("express");
var router = express.Router();
const { SerialPort } = require('serialport');

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
  var port = "COM3"; // @ToDo: needs a way of how to decide for the right port
  let dbArray = [];
  let soundArray = [];

  var serialPort = new SerialPort({
      path: port,
      baudRate: 9600, 
    });

    serialPort.on("open", function() { // reacts on opening of the port
      console.log("-- Connection opened --");
      serialPort.write('*RST\n') 
      serialPort.write('INIT START\n') // starts the system
      for(var i = 0; i < 1000; i++){
        serialPort.write('MEAS:INIT\n') // starts the recording
        serialPort.write('MEAS:SLM:123?LAF\n') // saves the measurement
        serialPort.write('INIT STOP\n') // stops the recording 
      }
      serialPort.on("data", function(data) { // everytime data is received
        console.log("Data received: " + data);
        dbArray.push("Data received: " + data); // saves data in the array
      });
      setTimeout(function(){
        serialPort.close() // closes the port
        sounddatenBearbeiten();
      }, 10000)
    });


  /**
  * builds the soundArray, so there are 
  * only a db number for every secound 
  */
  function sounddatenBearbeiten(){
    var counter = 0;
    var hilfe = 0;
    for(var i = 0; i< dbArray.length; i++){
      soundArray[counter] = (parseFloat(dbArray[i].slice(15, 19)) +4);
      if(hilfe === 5){
        hilfe = 0;
        i = i + 4;
      }
      i = i + 3; // thus only 20 values will be used for every secound 
      counter++;
      hilfe++;
    }
    console.log(soundArray);
    res.render("kal-lead", {titel: "Kalibrierung", array: soundArray})
  }
})

module.exports = router;
