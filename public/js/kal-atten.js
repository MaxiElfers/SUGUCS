/***** all getElements *****/
let btn_Gcal = document.getElementById("btn_Gruppenkalibrierung");
let btn_Cal = document.getElementById("btn_Kalibrierung");
let in_GroupCode = document.getElementById("input_GroupCode");
let in_UserID = document.getElementById("input_UserID");
let output_error_cal = document.getElementById("output_Error_Cal");
let output_error_down = document.getElementById("output_Error_Down");
let output_error_spin = document.getElementById("output_Error_Spin");
let out_fin = document.getElementById("out_finished");
let an_s1 = document.getElementById("s1");
let an_s2 = document.getElementById("s2");
let an_s3 = document.getElementById("s3");
let an_txt = document.getElementById("AnleitungText");

/***** all EventListeners ******/
btn_Gcal.addEventListener("click", function(){checkError("Cal");});
btn_Cal.addEventListener("click", function(){checkError("Down");});
an_s1.addEventListener("click", function(){handleAnleitung("s1");});
an_s2.addEventListener("click", function(){handleAnleitung("s2");});
an_s3.addEventListener("click", function(){handleAnleitung("s3");});

/***** all Variables ******/
let allDeltas = {};
let deltaArr = [];
let xl2Array = [];
let soundArray = [];
let group_code;
let userID;
let calibrationObject;
let SBID = "63c3f0c9a122c30008268cc0";
let SBSensor = "63c3f0c9a122c30008268cc1";
let SBID2 = "63ce890239ae8400078b2eae";
let SBSensor2 = "63ce890239ae8400078b2eaf";
let AT2 = "eb7affe1d25eee7f0a4aa62bcdbd4130a22f3338bf5fc3635fd4464bc491ccea";
// Demo
//let soundArray = [71, 56, 45, 45, 47, 46, 56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 55, 56, 45, 45, 47, 46, 56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55]

/***** all functionalities ******/

/**
 * tests that the preconditions are given, so 
 * the calibration can be done without a problem 
 * @param {String} type - what button called this function
 */
function checkError(type){
    let error = false;
    // Here start the code for the groupcalibration button (btn_Gcal)
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
                btn_Cal.classList.add("btn-primary");
                btn_Cal.classList.remove("btn-secondary", "disabled");
                in_UserID.readOnly = false;
                handleAnleitung("s3");
            }
        }
    }
    // Here start the code for the calibration button (btn_Cal)
    else if(type === "Down"){
      userID = in_UserID.value;
      if(userID === " "){
        output_error_down.innerHTML = "Keine UserID angegeben";
      }
      else{
        if(userID.length != 10){
          output_error_down.innerHTML = "UserID muss 10 zeichen lang sein"
        }
        else{
          var problem = false;
          for(var i = 0; i < 10; i++){
            if(isNaN(userID[i])){
              output_error_down.innerHTML = "Nur Zahlen erlaubt!";
              problem = true;
            }
          }
          if(!problem){
            parseInt(in_UserID.value);
            output_error_down.innerHTML = "";
            soundArray = tonspurBearbeiten(modell);
            console.log("soundArray:",soundArray)
            getReferenceData(); 
          }
        }
      }
    }
    // Here start the code for the messung stoppen button (messungStoppenButton)
    else if(type === "messung"){
      if(ausgabeMessung.innerHTML === "Messung erfolgreich!"){
        handleAnleitung("s2");
        btn_Gcal.classList.remove("btn-secondary", "disabled");
        btn_Gcal.classList.add("btn-primary");
        in_GroupCode.readOnly = false;
        messungButton.classList.add("disabled");
      } 
    }
  }

/**
 * Handles the changing of the sites from the Anleitung
 * @param {String} Seite which should be displayed
 */
function handleAnleitung(Seite){
  if(Seite === "s1"){
    an_s1.classList.remove("btn-outline-secondary");
    an_s1.classList.add("btn-success");
    an_s2.classList.remove("btn-success");
    an_s2.classList.add("btn-outline-secondary");
    an_s3.classList.remove("btn-success");
    an_s3.classList.add("btn-outline-secondary");
    an_txt.innerHTML = '1. Wenn der Leiter bescheid gibt, drücken Sie bitte „Messung starten“ </br></br> 2. Stoppen Sie die Messung, indem Sie auf „Messung stoppen“ klicken, nachdem Ihnen der Leiter mit einem Handzeichen Bescheid gegeben hat </br></br> Fahren Sie auf der nächsten Seite fort </br>'
}
else if(Seite === "s2"){
    an_s2.classList.remove("btn-outline-secondary");
    an_s2.classList.add("btn-success");
    an_s1.classList.remove("btn-success");
    an_s1.classList.add("btn-outline-secondary");
    an_s3.classList.remove("btn-success");
    an_s3.classList.add("btn-outline-secondary");
    an_txt.innerHTML = '3. Geben Sie nun den vom Leiter erstellten Gruppen Code ein </br></br></br> 4. Speichern Sie Gruppen Code für den Kalibrierungsraum ab, indem Sie auf „Kalibrierungsraum speichern“ klicken   </br></br></br> Fahren Sie auf der nächsten Seite fort </br>'
}
else if(Seite === "s3"){
    an_s3.classList.remove("btn-outline-secondary");
    an_s3.classList.add("btn-success");
    an_s1.classList.remove("btn-success");
    an_s1.classList.add("btn-outline-secondary");
    an_s2.classList.remove("btn-success");
    an_s2.classList.add("btn-outline-secondary");
    an_txt.innerHTML = '5. Danach geben Sie bitte eine selbstüberlegte individuelle User ID ein </br></br> 6. Merken Sie sich diese User ID </br></br></br> 7. Zum Schluss drücken Sie auf „Kalibrierung starten“ </br></br>'
}
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
            //allDeltas[i] = +allDeltas[i].toFixed(2); // rounds the delta down to two after komma numbers
            helpVar++;
        }
    })
}

/**
 * create the calibrationObject, which will be used 
 * for all further sound measurements of the current 
 * user
 * This funciton also posts the created calibration object
 * onto the OpenSenseMap Server  
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
    // start the object with the user ID
    const preparedCalibrationO = [
      {
        "sensor": "63ce890239ae8400078b2eaf",
        "value": userID
      }];
    for(var i = 1; i < 120; i++){
      // when there is no awailable delta, use 0
      if(allDeltas[i] === undefined){
        value = {
          "sensor": "63ce890239ae8400078b2eaf",
          "value": 0
        }
        preparedCalibrationO.push(value)
      }
      // if there is an availably delta, use it
      else{
        value = {
          "sensor": "63ce890239ae8400078b2eaf",
          "value": allDeltas[i]
        }
        preparedCalibrationO.push(value)
      }
    }
    fetch(`https://api.opensensemap.org/boxes/${SBID2}/data`, {
      method: 'POST',
      headers: {
          'Authorization': AT2,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(preparedCalibrationO)
    })
    .then(response => response.json())
    .then(response => console.log(JSON.stringify(response)))
}

/**
 * fetches the reference data of the XL2 
 * from the OpenSenseMap Server 
 */
function getReferenceData() {
    fetch(`https://api.opensensemap.org/boxes/${SBID}/data/${SBSensor}?`).then(function(response) {
        return response.json();
    }).then(function(data) {
        // Filter die letzten 100 Einträge + 1 Group-Code heraus
        for(let i = 0; i < 150; i++) {
            xl2Array.push(parseInt(data[i].value))
        }
        console.log("xl2Array:",xl2Array)
        if(xl2Array[0] === group_code){
          xl2Array = xl2Array.slice(1,201);
          btn_Gcal.classList.remove("btn-primary");
          btn_Cal.classList.remove("btn-success");
          output_error_down.classList.remove("text-danger");
          btn_Cal.classList.add("btn-secondary", "disabled");
          btn_Gcal.classList.add("btn-secondary", "disabled");
          output_error_down.classList.add("text-success");
          output_error_cal.innerHTML = "";
          calibration(xl2Array, soundArray);
          console.log(deltaArr)
          estimateAllDelta();
          console.log(allDeltas)
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

/*****************************************************************************
 * The following is mostly (except the shortening of the array)
 * copied and changed for our needs from the App groups webaudio
 * For more information about this code please refer to the App/Messung Group
 *****************************************************************************/

// Source:
//https://github.com/takispig/db-meter

var stream;
var average = 0;
var mindestDatenProAufnahme = 200;
let measurementCount = 0;
let startTime;
let mitzaehlen = false;
let anzahlMessungenProSekunde = 0;
let anzahlMessungen = 0;
let ausgabedurchschnitt = 0;
let gemessenesdB = 0;

//Testarray for offest
var testarray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var con;

messungButton = document.getElementById("messung");
messungStoppenButton = document.getElementById("messungStoppen");
ausgabeMessung = document.getElementById("AusgabeMessung");

messungStoppenButton.disabled = true;
messungButton.addEventListener("click", startMessung);
messungStoppenButton.addEventListener("click", stoppMessung);
messungStoppenButton.addEventListener("click", function(){checkError("messung");});

function startMessung() {
  modell = [];
  startTime = performance.now();
  messungButton.disabled = true;
  messungStoppenButton.disabled = false;

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
          modell.push(average);
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

// stopping measurment
function stoppMessung() {
  messungButton.disabled = false;
  messungStoppenButton.disabled = true;
  if (modell.length > mindestDatenProAufnahme) {
    con.suspend();
    console.log("modell: ", modell);
    var summe = 0;
    for (let i = 0; i < modell.length; i++) {
      summe = summe + modell[i].value;
    }
    ausgabeMessung.innerHTML = "Messung erfolgreich!";
  }
  else{
    ausgabeMessung.innerHTML = "Messung fehlgeschlagen. Wenden Sie sich an ihren Leiter";
  }
}

///////////////////////////////////////////////////////////////////////////
//// Array kürzen
///////////////////////////////////////////////////////////////////////////

/**
 * Changes the given tonspur, so that is has exactly 169 values
 * @param {Array} tonspur 
 * @returns  
 */
function tonspurBearbeiten(tonspur) {
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

  var realMaxIndex = maxIndex;
  // gucken, dass es wirklich der letzte aufgenommene dB-Wert des Starttons ist
  for (i = maxIndex + 1; i < maxIndex + 30; i++) {
    // 10 als Zeiteinheit für maximale Länge des Starttons
    if (tonspur[maxIndex] - 1 < tonspur[i]) {
      // Maximal 5dB unterschied als zugelassene Varianz
      realMaxIndex = i;
    }
  }

  // überprüfen ob Array groß genug ist bzw. ganze Zeit aufgenommen hat
  if (tonspur.length - realMaxIndex + 149 > 0) {
    // 150 Testzeiteinheit für zu kalibrierendes Audio
    var tonspur_short = tonspurKuerzen(realMaxIndex, tonspur);
    tonspur_short.forEach((ton, index) => {
      tonspur_short[index] = Math.round(ton);
    })
    return tonspur_short;
  } else {
    console.log("Aufnahme ist zu kurz");
  }
}

/**
 * Shortens the given tonspur beginning at the given MaxIndex
 * to 169 values
 * @param {Number} max - Index of the max dB
 * @param {Array} tonspur - Array that will be shortend
 * @returns the tonspur that is shorter
 */
function tonspurKuerzen(max, tonspur) {
  console.log("Bereit zum kuerzen");
  // Array kürzen auf richtige Länge
  tonspur = tonspur.slice(max, max + 149);
  console.log("tonspur: ", tonspur);
  return tonspur;
}



/**********************
 * Notfalls Demo      *
 **********************/

let btn_notfalls_demo1 = document.getElementById("btn_demo1");
let btn_notfalls_demo2 = document.getElementById("btn_demo2");
btn_notfalls_demo1.addEventListener("click", startDemo);
btn_notfalls_demo2.addEventListener("click", continueDemo);
let userDemoData = [40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,7,7,7,7,7,7,7,7,7,7,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,22,22,22,22,22,22,22,22,22,22,9,9,9,9,9,9,9,9,9,9,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,8,8,8,8,8,8,8,8,8,8,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,7,7,7,7,7,7,7,7,7,31,31,31,31,31,31,31,31,31,31,31,31]

function startDemo(){
  console.log(userDemoData);
  btn_Gcal.classList.remove("btn-secondary", "disabled");
  btn_Gcal.classList.add("btn-primary");
  in_GroupCode.readOnly = false;
}

function continueDemo(){
    soundArray = userDemoData;
    userID = in_UserID.value;
    xl2Array.pop();
    getReferenceData()
}

function showNotfall(){
    btn_notfalls_demo1.classList.remove("visually-hidden")
    btn_notfalls_demo2.classList.remove("visually-hidden")
}