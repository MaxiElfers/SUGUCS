/**********************************
 ********* XL2 Aufnahme ***********
 **********************************/

const { SerialPort } = require('serialport')
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
    serialPort.close()
    sounddatenBearbeiten();
  }, 11000)
});

function sounddatenBearbeiten(){
  var counter = 0;
  for(var i = 0; i< dbArray.length; i++){
    soundArray[counter] = parseFloat(dbArray[i].slice(15, 19));
    i += 99;
    counter++;
  }
  console.log(soundArray);
}