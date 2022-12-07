// Source:
//https://github.com/takispig/db-meter

var refresh_rate = 500;
var stream;
var offset = 30;
var average = 0;

const db = document.getElementById("db");
var con;
var con;

aufnahmeButton = document.getElementById("aufnahme");
aufnahmeStoppenButton = document.getElementById("aufnahmeStoppen");
aufnahmeStoppenButton = document.getElementById("aufnahmeStoppen");
aufnahmeButton.addEventListener("click", startaufnahme);
aufnahmeStoppenButton.addEventListener("click", stoppaufnahme);

var anzahlDatenProAufnahme = 0;

aufnahmeStoppenButton.addEventListener("click", stoppaufnahme);

var mindestDatenProAufnahme = 50;

function startaufnahme() {
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then((stream) => {
      const context = new AudioContext();
      con = context;
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

        average = 20 * Math.log10(values / data.length) + offset;
        if (isFinite(average)) {
          db.innerText = average;
          //Klonen der Aufnahmestruktur aus modell.js
          let a = Object.assign({}, aufnahme);
          a.value = average;
          modell.push(a);
        }
        //stoppaufnahme(context);
        /*
        //stoppaufnahme(context);
        /*
        if (
          context.state === "running" &&
          modell.length >= anzahlDatenProAufnahme
        ) {
          context.suspend().then(() => {
            aufnahmeButton.textContent = "Weiter aufnehmen";
            console.log(aufnahme);
          });
        }
        */
      };
    });

  // update the volume every refresh_rate m.seconds
  var updateDb = function () {
    window.clearInterval(interval);

    var volume = Math.round(modell.reduce((a, b) => a + b) / modell.length);
    //var volume = Math.round(Math.max.apply(null, aufnahme));
    if (!isFinite(volume)) volume = 0; // we don't want/need negative decibels in that case
    db.innerText = volume;
    aufnahme = []; // clear previous values

    interval = window.setInterval(updateDb, refresh_rate);
  };
  var interval = window.setInterval(updateDb, refresh_rate);

  //aufnahmeStoppenButton.addEventListener("click", console.log("hallo"));

  //aufnahmeStoppenButton.addEventListener("click", console.log("hallo"));
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
function stoppaufnahme() {
  if (modell.length > 50) {
    con.suspend();
    console.log(modell);
  }

  if (aufnahme.length > mindestDatenProAufnahme) {
    con.suspend();
    console.log(aufnahme);
  }
}

document.getElementById("hinzufuegen").addEventListener("click", function () {
  getValues();
});

function getValues() {
  // Daten einlesen
  var newName = document.getElementById("NameDiv").value;
  var newModell = modell;
  var newStandort = pos;
  //console.log(newName, newModell, newStandort);
  document.getElementById("FehlerDiv").style.display = "none";
  document.getElementById("FehlerDiv2").style.display = "none";
  document.getElementById("FehlerDiv3").style.display = "none";
  if (newName == "") {
    document.getElementById("FehlerDiv3").style.display = "block";
  } else if (newModell.length == 0) {
    document.getElementById("FehlerDiv").style.display = "block";
  } else if (newStandort == null) {
    document.getElementById("FehlerDiv2").style.display = "block";
  } else {
    var durchschnitt = getDurchschnitt(newModell);

    data = {
      name: newName,
      geometry: {
        type: "Point",
        coordinates: newStandort,
      },
      aufnahme: newModell,
      Durchschnitt: durchschnitt,
    };
    console.log(data);
    postData(data);
  }
}

/**
 * Berechnet den Durchschnitt aus einem Feld mit int Werten
 * @param {int} aufnahmeen
 * @returns durchschnitt
 */
function getDurchschnitt(aufnahmeen) {
  var Summe = 0;
  for (var i = 0; i < aufnahmeen.length; i++) {
    Summe = Summe + aufnahmeen[i].value;
  }
  return Summe / aufnahmeen.length;
}

/**
 * Fetcht die neuen Daten
 * @param doc zu postende Daten
 */
function postData(doc) {
  fetch("/addData", {
    headers: { "Content-Type": "application/json" },
    method: "post",
    body: JSON.stringify(doc),
  });
}