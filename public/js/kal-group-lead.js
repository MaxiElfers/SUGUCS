let btn_calibration = document.getElementById("btn_Kalibrierung");
let input_GroupCode = document.getElementById("input_GroupCode");
let output_error = document.getElementById("output_Error");
let btn_Gcal = document.getElementById("btn_Gruppenkalibrierung");
let in_file = document.getElementById("in_file");
let btn_xl2 = document.getElementById("btn_XL2");
let in_soundArray = document.getElementById("soundArray")

btn_Gcal.addEventListener("click", function(){checkError("group");});
btn_xl2.addEventListener("click", function(){window.location = '/kalibrierung/XL2';});

const audio_steig = new Audio('/sounds/DB_steigend.mpeg');
const audio_const = new Audio('/sounds/DB_konstant.mpeg');
const audio_schwan = new Audio('/sounds/DB_schwankend.mpeg');


/**
 * tests that the preconditions are given, so 
 * the calibration can be done without a problem 
 * @param {*} art Array of which calibration method will be used
 */
function checkError(art){
    if(art === "group"){
        let code = input_GroupCode.value;
        if(code.length > 7){
            output_error.innerHTML = "Input zu lang!"
        }
        else if(code.length < 7){
            output_error.innerHTML = "Input zu kurz!"
        }
        else{
            for(var i = 0; i < code.length; i++){
                if(isNaN(code[i])){
                    output_error.innerHTML = "Nur Zahlen erlaubt!"
                }
            }
        }
        // Here is the space where the function that will be called for
        // the group calibration will end up
    }
    else if(art === "single"){
        return;
        // Here is some space so the error check for the single 
        // calibration can be added
        
        // Here is the space where the function that will be called for 
        // the single calibration will end up
    }
    // Posibility to add more error checks
}

/**
 * function plays the Audio for the calibration,
 * if button "Sound Starten" is clicked
 */
function playSound(){
    audio_schwan.play();
}

let referenceDaten = [10, 40];
let gelieferteDaten = [4, 42];
let allDeltas = [];
let soundDatei;
let xl2Tonspur = in_soundArray.innerHTML.split(',');
var counter = 0;

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
    return;
}

/**
 * This function calculates an Array of deltas,
 * which then can be added to all the collected 
 * data to calibrate them
 * For this function the sound must be exactly 
 * the same lenght every time
 */
function multiDeltaKali(){
    gelieferteDaten1.forEach((Wert, index) => {
        multiDelta[index] = referenceDaten1[index] - Wert;
    })
}


/**
 * This function adds the calculated Delta to the data of 
 * a single calibration or groupcalibration
 * @param {*} delta 
 * @param {*} data 
 */
function deltaAnwenden(delta, data){
    if(delta === "single"){
        data.forEach((number,index) => {
            data[index] = number + singleDelta;
        })
    }
    else{
        data.forEach((number, index) => {
            data[index] = number + multiDelta[index]; 
        })
    }
}


function getAudioFile(){
    var reader = new FileReader();
    reader.onload = (event) => {
        soundDatei = event.target.result;
        console.log(soundDatei);
    };
    reader.readAsArrayBuffer(in_file.files[0]);
}

async function getAudio(){
    let audioData = await fetch('/sounds/Testaudio_XL2.wav').then(r => r.arrayBuffer());
    let audioCtx = new AudioContext({sampleRate:44100});
    let decodedData = await audioCtx.decodeAudioData(audioData); // audio is resampled to the AudioContext's sampling rate
    console.log(decodedData.length, decodedData.duration, decodedData.sampleRate, decodedData.numberOfChannels);
    let float32Data = decodedData.getChannelData(0); // Float32Array for channel 0
    
    console.log(float32Data);
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
    tonspur = tonspur.slice(max, max + 30)
    console.log(tonspur)
  }