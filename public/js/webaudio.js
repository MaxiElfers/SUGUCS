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

Sens2Delta = "63ce890239ae8400078b2eaf";
ID = "63ce890239ae8400078b2eae";
//Testarray for offest
var testarray = [35, 30, 25, 30, 35, 30, 25, 30, 30, 30, 30];


const db = document.getElementById("db");
var con;
var con;
let durchschn = document.getElementById("ausg");
let maxim = document.getElementById("maxima");

messungButton = document.getElementById("messung");
messungStoppenButton = document.getElementById("messungStoppen");
var userIDDiv = document.getElementById("userID");
var nameDiv = document.getElementById("NameDiv");
var osbDiv = document.getElementById("OpenSenseBoxDiv");
var fehlerDiv0 = document.getElementById("FehlerDiv0");

userIDDiv.value = "12345";
nameDiv.value = "SUGUCS";
osbDiv.value = "";

// Buttons disablen
messungButton.disabled = true;
messungStoppenButton.disabled = true;

messungButton.addEventListener("click", startMessung);
messungStoppenButton.addEventListener("click", stoppMessung);

// Button zur Messung disablen solange nicht alle anderen Werte eingegeben wurden

userIDDiv.addEventListener("change", function () {
  if (
    userIDDiv.value == "" ||
    osbDiv.value == "" ||
    nameDiv.value == "" ||
    pos == undefined
  ) {
    messungButton.disabled = true;
  } else {
    messungButton.disabled = false;
  }
});
nameDiv.addEventListener("change", function () {
  if (
    userIDDiv.value == "" ||
    osbDiv.value == "" ||
    nameDiv.value == "" ||
    pos == undefined
  ) {
    messungButton.disabled = true;
  } else {
    messungButton.disabled = false;
  }
});
osbDiv.addEventListener("change", function () {
  if (
    userIDDiv.value == "" ||
    osbDiv.value == "" ||
    nameDiv.value == "" ||
    pos == undefined
  ) {
    messungButton.disabled = true;
  } else {
    messungButton.disabled = false;
  }
});


var mindestDatenProAufnahme = 50;

function startMessung() {
  fetch(`https://api.opensensemap.org/boxes/${SBID}/data/${SBSensor}?`).then(
    function (response) {
      return response.json();
    }
  );

  startTime = performance.now();
  messungStoppenButton.disabled = false;
  var newName = document.getElementById("NameDiv").value;
  var osbID = document.getElementById("OpenSenseBoxDiv").value;
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
        
  fetch(`https://api.opensensemap.org/boxes/${ID}/data/${Sens2Delta}?`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //Finden der UserID
      for (let i = 0; i < data.length; i = i + 120) {
        if (data[i].value == userID.value) {
          userID_i = i;
          break;
        }
      }
      if (userID_i == null) {
        console.log("UserID falsch");
        fehlerDiv0.style.display = "block";
      } else {
        fehlerDiv0.style.display = "none";
        //Filtern der 120 Werte
        for (let i = userID_i + 1; i < userID_i + 120; i++) {
          deltas.push(data[i]);
        }
        startTime = performance.now();
        messungStoppenButton.disabled = false;
        var newName = document.getElementById("NameDiv").value;
        var osbID = document.getElementById("OpenSenseBoxDiv").value;
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

              for (let i = 0; i < data.length; i++) {
                values += data[i];
              }

              average = Math.round(20 * Math.log10(values / data.length) + 25);

              if (isFinite(average) && average >= 0) {
                measurementCount++;

                //adding the offset
                var messungDelta =
                  average + parseInt(deltas[average - 1].value);

                db.innerText = messungDelta;

                // FIltern der SensorID
                let sensor;
                senseBoxIDs.forEach((item) => {
                  if (item.senseBoxID == osbDiv.value) {
                    sensor = item.sensorID;
                  }
                });

                //Klonen der Aufnahmestruktur aus modell.js
                let a = Object.assign({}, aufnahme);
                a.lat = pos[0];
                a.lon = pos[1];
                a.value = messungDelta;
                //a.boxName = newName;
                a.sensor = sensor;
                a.createdAt = new Date().toISOString();
                modell.push(a);
              }
            };
            //Anzeigemeter
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
    });
}

/**
 * Funktion zum Stoppen der Soundaufnahme
 */
function stoppMessung() {
  messungStoppenButton.disabled = true;
  // sicherstellen, dass Mindestanzahl an Datenwerten vorliegt
  if (modell.length > mindestDatenProAufnahme) {
    con.suspend();
    console.log(modell);
    var summe = 0;
    for (let i = 0; i < modell.length; i++) {
      summe = summe + modell[i].value;
    }
    // Nachricht mit Durchschnittlicher Anzahl an Werten pro Sekunde zurückgeben
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

document.getElementById("hinzufuegen").addEventListener("click", function () {
  getValues();
});

/**
 * Funktion zum Einlesen aller Daten auf der Seite
 * Daten werden in einem GeoJSON gespeichert und in der Konsole ausgegeben
 * Fehler, dass Daten unvollständig sind, wird abgefangen
 */
function getValues() {
  // Daten einlesen
  var newName = document.getElementById("NameDiv").value;
  var newModell = modell;
  var newStandort = pos;
  //console.log(newName, newModell, newStandort);
  document.getElementById("FehlerDiv").style.display = "none";
  document.getElementById("FehlerDiv2").style.display = "none";
  document.getElementById("FehlerDiv3").style.display = "none";
  // Fehler, dass Daten unvollständig, abfangen
  if (newName == "") {
    document.getElementById("FehlerDiv3").style.display = "block";
  } else if (newModell.length == 0) {
    document.getElementById("FehlerDiv").style.display = "block";
  } else if (newStandort == null) {
    document.getElementById("FehlerDiv2").style.display = "block";
  } else {
    messungHinzufuegen();
  }
}

/**
 * Berechnet den Durchschnitt aus einem Feld mit int Werten
 * @param {int} Messungen
 * @returns durchschnitt
 */
function getDurchschnitt(Messungen) {
  var Summe = 0;
  for (var i = 0; i < Messungen.length; i++) {
    Summe = Summe + Messungen[i].value;
  }
  return Summe / Messungen.length;
}

/**
 * Funktion zum Erhöhen der Messung um 1
 */
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

/**
 * Kopieren der IDs über onClick
 * @param {*} event
 */
function kopieren(event) {
  // Get the text field
  var copyText = document.getElementById(
    event.attributes[1].nodeValue + "Input"
  );

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices
  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);
  // Alert the copied text
  alert("Copied the text: " + copyText.value);
}

/**
 * Läd die Daten in die OpenSenseMap
 */
function messungHinzufuegen() {
  //Token filtern
  let token;
  senseBoxIDs.forEach((item) => {
    if (item.senseBoxID == osbDiv.value) {
      token = item.token;
    }
  });
  fetch("https://api.opensensemap.org/boxes/" + osbDiv.value + "/data", {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(modell),
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(JSON.stringify(response));
      document.getElementById("erfolgreichHochgeladen").style.display = "block";
    });