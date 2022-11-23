// Source:
//https://github.com/takispig/db-meter

var localDbValues = []; // array to store db values for each loop withing the refresh_rate
var refresh_rate = 5000;
var stream;
var offset = 30;
var average = 0;

const db = document.getElementById("db");

messungButton = document.getElementById("messung");
messungButton.addEventListener("click", startMessung);
var anzahlDatenProAufnahme = 0;

function startMessung() {
  anzahlDatenProAufnahme = anzahlDatenProAufnahme + 100;
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then((stream) => {
      const context = new AudioContext();
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

        average = 20 * Math.log10(values / data.length)+offset;
        if (isFinite(average)){
          db.innerText = average;
          localDbValues.push(average);
        }
        
        if (context.state === "running" && localDbValues.length >= anzahlDatenProAufnahme) {
          context.suspend().then(() => {
            messungButton.textContent = "Weiter aufnehmen";
            console.log(localDbValues);
          });
        } 
     
      };
      
    });

  // update the volume every refresh_rate m.seconds
  var updateDb = function () {
    window.clearInterval(interval);

    var volume = Math.round(
      localDbValues.reduce((a, b) => a + b) / localDbValues.length
    );
    //var volume = Math.round(Math.max.apply(null, localDbValues));
    if (!isFinite(volume)) volume = 0; // we don't want/need negative decibels in that case
    db.innerText = volume;
    localDbValues = []; // clear previous values

    interval = window.setInterval(updateDb, refresh_rate);
  };
  var interval = window.setInterval(updateDb, refresh_rate);


}

// change update rate
function changeUpdateRate() {
  refresh_rate = Number(document.getElementById("refresh_rate").value);
  document.getElementById("refresh_value").innerText = refresh_rate;
  intervalId = window.setInterval(function() {
      updateDb;
  }, refresh_rate);
}

// stopping measurment
function stoppMessung() {
  console.log("test");
  console.log(context);
}


