// Source:
//https://github.com/takispig/db-meter

var refresh_rate = 5000;
var stream;
var offset = 30;
var average = 0;

const db = document.getElementById("db");
var con;

messungButton = document.getElementById("messung");
messungStoppenButton = document.getElementById("messungStoppen");
messungButton.addEventListener("click", startMessung);
messungStoppenButton.addEventListener("click", stoppMessung);

var anzahlDatenProAufnahme = 0;


function startMessung() {
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

        average = 20 * Math.log10(values / data.length) + offset;
        if (isFinite(average)) {
          db.innerText = average;
          aufnahme.push(average);
        }
        //stoppMessung(context);
        /*
        if (
          context.state === "running" &&
          aufnahme.length >= anzahlDatenProAufnahme
        ) {
          context.suspend().then(() => {
            messungButton.textContent = "Weiter aufnehmen";
            console.log(aufnahme);
          });
        }
        */
      };

    });

  // update the volume every refresh_rate m.seconds
  var updateDb = function () {
    window.clearInterval(interval);

    var volume = Math.round(aufnahme.reduce((a, b) => a + b) / aufnahme.length);
    //var volume = Math.round(Math.max.apply(null, aufnahme));
    if (!isFinite(volume)) volume = 0; // we don't want/need negative decibels in that case
    db.innerText = volume;
    aufnahme = []; // clear previous values

    interval = window.setInterval(updateDb, refresh_rate);
  };
  var interval = window.setInterval(updateDb, refresh_rate);


        //messungStoppenButton.addEventListener("click", console.log("hallo"));
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
 
  if (aufnahme.length > 50){
  con.suspend();
  console.log(aufnahme);
  tonspurMax(aufnahme)
}
}

///////////////////////////////////////////////////////////////////////////
//// Array kürzen
///////////////////////////////////////////////////////////////////////////

// Tonspur Startton(Maximum) finden
function tonspurMax(tonspur) {
  console.log("Array Laenge ist: " + tonspur.length)

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
  console.log("Max Index ist: " + maxIndex)

  var realMaxIndex = maxIndex
  // gucken, dass es wirklich der letzte aufgenommene dB-Wert des Starttons ist
  for(i = maxIndex + 1; i < maxIndex + 10; i++) { // 10 als Zeiteinheit für maximale Länge des Starttons 
      if(tonspur[maxIndex] - 5 < tonspur[i]) { // Maximal 5dB unterschied als zugelassene Varianz
          realMaxIndex = i 
      }
  }
  console.log("Real Max Index ist: " + realMaxIndex)

  // überprüfen ob Array groß genug ist bzw. ganze Zeit aufgenommen hat
  if ( tonspur.length - realMaxIndex + 30 > 0 ) { // 30 Testzeiteinheit für zu kalibrierendes Audio
      tonspurKuerzen(realMaxIndex, tonspur)
  } else {
      console.log("Aufnahme ist zu kurz")
  }
}

// Tonspur kürzen
function tonspurKuerzen(max, tonspur) {
  console.log("Bereit zum kuerzen")
  // Array kürzen auf richtige Länge
  aufnahme = tonspur.slice(max, max + 30)
  console.log(tonspur)
}
