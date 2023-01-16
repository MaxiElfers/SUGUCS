/***** all getElements *****/
let btn_calibration = document.getElementById("btn_Kalibrierung");
let input_GroupCode = document.getElementById("input_GroupCode");
let output_error = document.getElementById("output_Error");
let btn_Gcal = document.getElementById("btn_Gruppenkalibrierung");
let btn_recording = document.getElementById("btn_recording");
let in_file = document.getElementById("in_file");
let btn_xl2 = document.getElementById("btn_XL2");
let in_soundArray = document.getElementById("soundArray");
// noch anpassen
document.getElementById("Send").addEventListener("click", sendReferenceData)
document.getElementById("Get").addEventListener("click", getReferenceData)

/***** all EventListeners ******/
btn_Gcal.addEventListener("click", function(){checkError("group");});
btn_xl2.addEventListener("click", function(){window.location = '/kalibrierung/XL2';});
btn_recording.addEventListener("click", function(){playSound();});

/***** all Variables ******/
const audio_calibration = new Audio('/sounds/Calibration_sound.mpeg');
let xl2Tonspur = in_soundArray.innerHTML.split(',');
let counter = 0;
let SBID = "63c3f0c9a122c30008268cc0";
let SBSensor = "63c3f0c9a122c30008268cc1";
let AT = "e435ff67dd967d7211a529463861c5497025e410465f7c68935563ac54b6e62c";
// TestJson
let KaliWerteJson = [
    {
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },    {
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },    {
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },    {
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },    {
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },    {
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },    {
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },    {
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },    {
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":64
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":65
    },{
        "sensor":"63c3f0c9a122c30008268cc1",
        "value":63
    }
]


/***** all functionalities ******/

/**
 * tests that the preconditions are given, so 
 * the calibration can be done without a problem 
 */
function checkError(){
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
    
    // Posibility to add more error checks
}

/**
 * function plays the Audio for the calibration,
 * if button "Sound Starten" is clicked
 */
function playSound(){
    audio_calibration.play();
}
  
/**
 * Searches for the first maximum decible value
 * inside the given soundarray 
 * @param {Array} soundArray 
 * @returns {Number} max - is the indice of the first maximum decible value
 */
function soundArrayMax(soundArray) {
    if (soundArray.length > 0) {
        let max = soundArray[0];
        let maxIndex = 0;
        // search for maximum
        for (var i = 1; i < soundArray.length; i++) {
            if (soundArray[i] > max) {
                maxIndex = i;
                max = soundArray[i];
            }
        }
    
        var realMaxIndex = maxIndex
        // check that this value is really the last of the starting sound, as this sound is one secound long
        for(i = maxIndex + 1; i < maxIndex + 10; i++) { // 10 as time for the maximum length of the starting sound 
            if(soundArray[maxIndex] - 2 < soundArray[i]) { // maximum 2 decibles difference as varianz
                realMaxIndex = i 
            }
        }
        return realMaxIndex;
    }
    else{
        console.error("Fehlerhafter Lautstärke-Array übergeben") // Error handling
        // @todo  response auf der Website anzeigen
    }
}
  
/**
 * Slices the soundArray starting from the 
 * first max decible value down to 30 sound values
 * @param {Array} soundArray is the array that needs to be shortend
 */
function sliceSoundArray(soundArray) {
    const max = soundArrayMax(soundArray)
    if(soundArray[max] === undefined || soundArray[max+30] === undefined){
        console.error("Die Soundaufnahme ab dem Kalibrierungsstart ist zu kurz"); // Error handling
        // @todo  response auf der Website anzeigen
    }
    else{
        soundArray = soundArray.slice(max, max + 30) // shorten Array to 30 values
    }
}

/**
 * Uploads the measured sound array to the
 * OpenSenseMap Server as the reference data
 */
function sendReferenceData() {
    fetch(`https://api.opensensemap.org/boxes/${SBID}/data`, {
        method: 'POST',
        headers: {
            'Authorization': AT,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(KaliWerteJson)
    })
    .then(response => response.json())
    .then(response => console.log(JSON.stringify(response)))

    document.getElementById("OSMData").innerHTML = "Daten wurden hinzugefügt"

}