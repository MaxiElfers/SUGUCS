/***** all getElements *****/
let btn_Gcal = document.getElementById("btn_Gruppenkalibrierung");
let btn_Cal = document.getElementById("btn_Kalibrierung");
let in_GroupCode = document.getElementById("input_GroupCode");
let output_error_cal = document.getElementById("output_Error_Cal");
let output_error_down = document.getElementById("output_Error_Down");
let output_error_spin = document.getElementById("output_Error_Spin");
let out_fin = document.getElementById("out_finished");

/***** all EventListeners ******/
btn_Gcal.addEventListener("click", function(){checkError("Cal");});
btn_Cal.addEventListener("click", function(){checkError("Down");});

/***** all Variables ******/
let allDeltas = {};
let deltaArr = [];
let xl2Array = [];
//let soundArray = [];
let group_code;
const userArray = "?";
let calibrationObject;
let SBID = "63c3f0c9a122c30008268cc0";
let SBSensor = "63c3f0c9a122c30008268cc1";
// Tests
let soundArray = [71, 56, 45, 45, 47, 46, 56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57]

/***** all functionalities ******/

/**
 * tests that the preconditions are given, so 
 * the calibration can be done without a problem 
 */
function checkError(type){
    let error = false;
    if(type === "Cal"){
        let code = in_GroupCode.value;
        if(code.length > 7){
            output_error_cal.innerHTML = "Input zu lang!"
        }
        else if(code.length < 7){
            output_error_cal.innerHTML = "Input zu kurz!"
        }
        else{
            for(var i = 0; i < code.length; i++){
                if(isNaN(code[i])){
                    output_error_cal.innerHTML = "Nur Zahlen erlaubt!";
                    error = true;
                }
            }
            if(error === false){
                group_code = parseInt(in_GroupCode.value);
                output_error_cal.classList.remove("text-danger");
                output_error_cal.classList.add("text-success");
                output_error_cal.innerHTML = "Aktueller Raum-Code: " + group_code; 
            }
        }
    }
    else if(type === "Down"){
        if(group_code === undefined){
            output_error_down.innerHTML = "Kein Gruppen-Code angegeben";
        }
        else{
            output_error_down.innerHTML = "";
            getReferenceData();
        }
    }
    
    // Here is the space where the function that will be called for
    // the group calibration will end up

    // Posibility to add more error checks
}


/**
 * Takes the soundArray of the xl2 and the soundArray of
 * the device used by the user and compares them. The differences
 * in different decible heights will be taken the mean and that will 
 * be the delta for this height.
 * @param {Array} xl2Array - soundArray of the xl2
 * @param {Array} userArray - soundArray of the users device
 * @returns allDeltas - an Array of Deltas for different decibles
 */
function calibration(xl2Array, userArray){
    if(xl2Array.length === userArray.length){
        // calculates the delta for each known value
        userArray.forEach((sound, index) => {
            let delta = xl2Array[index] - sound;
            allDeltas[sound] = delta;
            deltaArr.push(delta);
        })
    }
    else{
        console.error("The sound files are not matching")
    }
}

/**
 * The rest of the allDeltas object will be filled
 * with an estimated value, thus the calibration can 
 * work for all the measured values
 * NOTE: Not all the values will be estimated. Only the ones 
 * in close proximity, which means +- 5 as decible is non linear,
 * which means estimating it can be hard
 */
function estimateAllDelta(){
    // takes out every double variable
    let soundArrayNoDouble = soundArray.filter((element, index) => {
    return soundArray.indexOf(element) === index;
    })
    // sorts the array from smallest to biggest
    soundArrayNoDouble.sort();
    // goes over all non double decible values 
    soundArrayNoDouble.forEach(value => {
        let helpVar = 2; // set, so the furthes away point (5 away) is only 1/2 of the original
        // calculates the deltas for all values +- 5 of the measured decible values
        for(var i = value - 5; i <= value + 5; i++){
            // empty: than just add the calculated value
            if(allDeltas[i] === undefined){ 
                allDeltas[i] = allDeltas[value] - (allDeltas[value] * (1 / (helpVar)));
            }
            // same index: reset helpVar
            else if(i === value){
                helpVar = 2;
            }
            // value is set from a different measured value: leave it like this
            else if(soundArrayNoDouble.includes(i)){
                // do nothing
            }
            // there is a number: calculate the mean between the new and the given value
            else{
                allDeltas[i] = (allDeltas[i] + allDeltas[value]) / 2;
            }
            allDeltas[i] = +allDeltas[i].toFixed(2); // rounds the delta down to two after komma numbers
            helpVar++;
        }
    })
}

/**
 * create the calibrationObject, which will be used 
 * for all further sound measurements of the current 
 * user
 */
function createCalibrationObject(){
    calibrationObject = {
        time: Date.now(),
        place: undefined,
        leader: undefined,
        numberOfAttendees: undefined,
        referenceMicrofon: "XL2",
        deltas: allDeltas,
        lengthTheCalibration: "10 secounds"
    }
}

/**
 * fetches the reference data of the XL2 
 * from the OpenSenseMap Server 
 */
function getReferenceData() {
    fetch(`https://api.opensensemap.org/boxes/${SBID}/data/${SBSensor}?`).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data);
        // Filter die letzten 100 Einträge + 1 Group-Code heraus
        for(let i = 0; i < 101; i++) {
            xl2Array.push(parseInt(data[i].value))
        }
        console.log(xl2Array)
        if(xl2Array[0] === group_code){
          xl2Array = xl2Array.slice(1,101);
          btn_Gcal.classList.remove("btn-primary");
          btn_Cal.classList.remove("btn-success");
          output_error_down.classList.remove("text-danger");
          btn_Cal.classList.add("btn-secondary", "disabled");
          btn_Gcal.classList.add("btn-secondary", "disabled");
          output_error_down.classList.add("text-success");
          output_error_cal.innerHTML = "";
          calibration(xl2Array, soundArray);
          estimateAllDelta();
          createCalibrationObject();
          console.log(calibrationObject);
          out_fin.classList.remove("visually-hidden");
        }
        else{
          xl2Array = [];
          output_error_down.innerHTML = "Zu dem angegebenen Code konnte kein Raum gefunden werden";
        }
    })
}




/******************** */

// Source:
//https://github.com/takispig/db-meter

var refresh_rate = 500;
var stream;
var offset = 30;
var average = 0;
var mindestDatenProAufnahme = 50;
var anzahlDatenProAufnahme = 50;
let measurementCount = 0;
let startTime;
let mitzaehlen = false;
let anzahlMessungenProSekunde = 0;
let anzahlMessungen = 0;
let ausgabedurchschnitt = 0;
let gemessenesdB = 0;

//Testarray for offest
var testarray = [35, 30, 25, 30, 35, 30, 25, 30, 30, 30, 30];
var con;

messungButton = document.getElementById("messung");
messungStoppenButton = document.getElementById("messungStoppen");

messungStoppenButton.disabled = true;
messungButton.addEventListener("click", startMessung);
messungStoppenButton.addEventListener("click", stoppMessung);

function startMessung() {
  startTime = performance.now();
  messungStoppenButton.disabled = false;
  anzahlDatenProAufnahme = anzahlDatenProAufnahme + 100;

  navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then((stream) => {
      const context = new AudioContext();
      con = context;
      // Creates a MediaStreamAudioSourceNode associated with a MediaStream representing an audio stream which may
      // come from the local computer microphone or other sources.
      const source = context.createMediaStreamSource(stream);
      // creates a ScriptProcessorNode used for direct audio processing
      const processor = context.createScriptProcessor(2048, 1, 1);
      // reates an AnalyserNode, which can be used to expose audio time and frequency data and create data visualizations
      const analyser = context.createAnalyser();

      // A double value representing the averaging constant with the last analysis frame —
      // basically, it makes the transition between values over time smoother.
      analyser.smoothingTimeConstant = 0.8;
      // An unsigned long value representing the size of the FFT (Fast Fourier Transform)
      // to be used to determine the frequency domain.
      analyser.fftSize = 256;

      source.connect(analyser);
      analyser.connect(processor);
      processor.connect(context.destination);

      processor.onaudioprocess = () => {
        var data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        var values = 0;

        for (var i = 0; i < data.length; i++) {
          //if (data[i]>130) data[i]=130;
          values += data[i];
        }

        average = 20 * Math.log10(values / data.length);

        if (isFinite(average) && average >= 0) {
          measurementCount++;
          //adding the offset
          let switchValue = Math.floor(average / 10);
          switch (switchValue) {
            case 0:
              average += testarray[0];
              break;
            case 1:
              average += testarray[1];
              break;
            case 2:
              average += testarray[2];
              break;
            case 3:
              average += testarray[3];
              break;
            case 4:
              average += testarray[4];
              break;
            case 5:
              average += testarray[5];
              break;
            case 6:
              average += testarray[6];
              break;
            case 7:
              average += testarray[7];
              break;
            case 8:
              average += testarray[8];
              break;
            case 9:
              average += testarray[9];
              break;
            case 10:
              average += testarray[10];
              break;
          }

          //db.innerText = Math.round(average * 1000) / 1000;
          //Klonen der Aufnahmestruktur aus modell.js
          let a = Object.assign({}, aufnahme);
          a.value = average;
          modell.push(a);
        }
      };
      const analyserNode = context.createAnalyser();
      source.connect(analyserNode);
      const pcmData = new Float32Array(analyserNode.fftSize);
      const onFrame = () => {
        analyserNode.getFloatTimeDomainData(pcmData);
        let sumSquares = 0.0;
        for (const amplitude of pcmData) {
          sumSquares += amplitude * amplitude;
        }
        volumeMeterEl.value = Math.sqrt(sumSquares / pcmData.length);
        window.requestAnimationFrame(onFrame);
      };

      window.requestAnimationFrame(onFrame);
    });
}

// change update rate
function changeUpdateRate() {
  refresh_rate = Number(document.getElementById("refresh_rate").value);
  document.getElementById("refresh_value").innerText = refresh_rate;
  intervalId = window.setInterval(function () {
    updateDb;
  }, refresh_rate);
}

// stopping measurment
function stoppMessung() {
  messungStoppenButton.disabled = true;
  if (modell.length > mindestDatenProAufnahme) {
    con.suspend();
    console.log(modell);
    var summe = 0;
    for (let i = 0; i < modell.length; i++) {
      summe = summe + modell[i].value;
    }
    if (anzahlMessungen == 1) {
      ausgabedurchschnitt = Math.round(anzahlMessungenProSekunde * 10) / 10;
      gemessenesdB = Math.round(summe / modell.length);
      durchschn.innerHTML = "Messung erfolgreich!";
      messungButton.textContent = "Neue Messung";
    } else {
      gemessenesdB = Math.round(summe / modell.length);
      durchschn.innerHTML = "Messung erfolgreich!";
    }
  }

  if (aufnahme.length > mindestDatenProAufnahme) {
    con.suspend();
    console.log(aufnahme);
  }
}

///////////////////////////////////////////////////////////////////////////
//// Array kürzen
///////////////////////////////////////////////////////////////////////////

// Tonspur Startton(Maximum) finden
function tonspurMax(tonspur) {
  console.log("Array Laenge ist: " + tonspur.length);

  // Maximum berechnen
  // überprüfen von Array
  if (tonspur.length === 0) {
    return -1;
  }
  var max = tonspur[0];
  var maxIndex = 0;
  // nach Maximum suchen
  for (var i = 1; i < tonspur.length; i++) {
    if (tonspur[i] > max) {
      maxIndex = i;
      max = tonspur[i];
    }
  }
  console.log("Max Index ist: " + maxIndex);

  var realMaxIndex = maxIndex;
  // gucken, dass es wirklich der letzte aufgenommene dB-Wert des Starttons ist
  for (i = maxIndex + 1; i < maxIndex + 10; i++) {
    // 10 als Zeiteinheit für maximale Länge des Starttons
    if (tonspur[maxIndex] - 5 < tonspur[i]) {
      // Maximal 5dB unterschied als zugelassene Varianz
      realMaxIndex = i;
    }
  }
  console.log("Real Max Index ist: " + realMaxIndex);

  // überprüfen ob Array groß genug ist bzw. ganze Zeit aufgenommen hat
  if (tonspur.length - realMaxIndex + 30 > 0) {
    // 30 Testzeiteinheit für zu kalibrierendes Audio
    tonspurKuerzen(realMaxIndex, tonspur);
  } else {
    console.log("Aufnahme ist zu kurz");
  }
}

// Tonspur kürzen
function tonspurKuerzen(max, tonspur) {
  console.log("Bereit zum kuerzen");
  // Array kürzen auf richtige Länge
  tonspur = tonspur.slice(max, max + 30);
  console.log(tonspur);
}

function anzahlMessungenErhoehen() {
  anzahlMessungen = anzahlMessungen + 1;
}

function openPopup() {
  // Get the information to display in the popup
  var deviceName = document.getElementById("NameDiv").value;
  var osbId = document.getElementById("OpenSenseBoxDiv").value;
  var location = document.getElementById("demo").innerHTML;
  var soundLevel = document.getElementById("db").value;
  // Update the information in the popup
  document.getElementById("device-name").innerHTML = deviceName;
  document.getElementById("osb-id").innerHTML = osbId;
  document.getElementById("location").innerHTML = location;
  document.getElementById("sound-level").innerHTML = gemessenesdB;
  document.getElementById("measurement-mean").innerHTML = ausgabedurchschnitt;
  // Show the popup
  document.getElementById("popup").style.display = "block";
}
function closePopup() {
  // Hide the popup
  document.getElementById("popup").style.display = "none";
}

setInterval(function () {
  //calculate the end time
  let endTime = performance.now();
  let timeInterval = (endTime - startTime) / 1000;
  if (mitzaehlen == true) {
    anzahlMessungenProSekunde = measurementCount / timeInterval;
    //console.log(`Number of measurements per second: ${measurementCount/timeInterval}`);
  }
}, 1000);

function kopieren() {
  // Get the text field
  var copyText = document.getElementById("sbid");

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);

  // Alert the copied text
  alert("Copied the text: " + copyText.value);
}