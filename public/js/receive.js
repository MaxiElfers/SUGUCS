/**********************************
 ********* XL2 Aufnahme ***********
 **********************************/

const { SerialPort } = require('serialport')
var port = "COM1";
let dbArray = [];

var serialPort = new SerialPort(port, {
  baudRate: 9600,
});

serialPort.on("open", function() {
  console.log("-- Connection opened --");
  serialPort.on("data", function(data) {
    console.log("Data received: " + data);
    dbArray.push(data);
  });
});