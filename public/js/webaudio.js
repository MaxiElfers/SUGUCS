var localDbValues = []; // array to store db values for each loop withing the refresh_rate
var refresh_rate = 5000;
var stream;
var offset = 30;
var average = 0;

const db = document.getElementById("db");

messungButton = document.getElementById("messung")
messungButton.addEventListener("click", startMessung)

function startMessung() {
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then((stream) => {
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const processor = context.createScriptProcessor(2048, 1, 1);
      const analyser = context.createAnalyser();

      analyser.smoothingTimeConstant = 0.8;
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
        
      };
    });
}
