/***** all getElements *****/
let btn_Gcal = document.getElementById("btn_Gruppenkalibrierung");
let btn_upload = document.getElementById("uploadData");
let btn_xl2 = document.getElementById("btn_XL2");
let in_GroupCode = document.getElementById("input_GroupCode");
let in_file = document.getElementById("in_file");
let in_soundArray = document.getElementById("soundArray");
let output_error_cal = document.getElementById("output_Error_Cal");
let output_error_up = document.getElementById("output_Error_Up");
let out_fin = document.getElementById("out_finished");

/***** all EventListeners ******/
btn_Gcal.addEventListener("click", function(){checkErrorAndStartWorkflow("Cal");});
btn_upload.addEventListener("click", function(){checkErrorAndStartWorkflow("Up");});
btn_xl2.addEventListener("click", function(){playSound(); window.location = '/kalibrierung/XL2';});

/***** all Variables ******/
const audio_calibration = new Audio('/sounds/Calibration_sound.mpeg');
let xl2Tonspur = in_soundArray.innerHTML.split(',');
let counter = 0;
let group_code;
let SBID = "63c3f0c9a122c30008268cc0";
let SBSensor = "63c3f0c9a122c30008268cc1";
let AT = "e435ff67dd967d7211a529463861c5497025e410465f7c68935563ac54b6e62c";
let preparedXL2Data = [];
//let xl2Tonspur = [71, 58, 47, 47, 49, 48, 56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57]

// build the site dependand if the xl2 data was already recorded
if(xl2Tonspur[0] != ''){
    btn_xl2.classList.remove("btn-primary");
    btn_xl2.classList.add("btn-secondary", "disabled");
    btn_Gcal.classList.remove("btn-secondary", "disabled");
    btn_Gcal.classList.add("btn-primary");
    btn_upload.classList.remove("btn-secondary", "disabled");
    btn_upload.classList.add("btn-primary");
    in_GroupCode.readOnly = false;
}

/***** all functionalities ******/

/**
 * tests that the preconditions are given, so 
 * the functionalities can work without problems
 * This function also starts the workflows 
 * @param {String} type - what buton called this function
 */
function checkErrorAndStartWorkflow(type){
    let error = false;
    // Here start the code for the groupcalibration button (btn_Gcal)
    if(type === "Cal"){
        let code = in_GroupCode.value;
        if(code.length > 7){
            output_error_cal.innerHTML = "Input zu lang!";
        }
        else if(code.length < 7){
            output_error_cal.innerHTML = "Input zu kurz!"
        }
        else{
            for(var i = 0; i < code.length; i++){
                if(isNaN(code[i])){
                    output_error_cal.innerHTML = "Nur Zahlen erlaubt!"
                    error = true;
                }
            }
            if(error === false){
                group_code = in_GroupCode.value;
                btn_Gcal.classList.remove("btn-primary")
                btn_Gcal.classList.add("btn-secondary", "disabled")
                output_error_cal.classList.remove("text-danger");
                output_error_cal.classList.add("text-success");
                output_error_cal.innerHTML = "Lade Teilnehmer ein mit dem Code: " + group_code; 
            }
        }
    }
    // Here start the code for the upload button (btn_upload)
    else if(type === "Up"){
        if(xl2Tonspur[0] === ""){
            output_error_up.innerHTML = "Keine Tonspur vorhanden";
        }
        else if(group_code === undefined){
            output_error_up.innerHTML = "Keine Gruppe erstellt";
        }
        else{
            output_error_up.innerHTML = "";
            prepareXL2Data();
            sendReferenceData();
            output_error_cal.innerHTML = " "; 
            btn_upload.classList.remove("btn-success");
            btn_upload.classList.add("disabled", "btn-secondary");
            out_fin.classList.remove("visually-hidden");
        }
    }
    
    // Posibility to add more error checks
}

/**
 * function plays the Audio for the calibration,
 * if button "Sound Starten" is clicked
 */
function playSound(){
    setTimeout(audio_calibration.play(), 1000);
}

/**
 * takes the recorded XL2 Soundarray and converts it into 
 * a new Array, which corresponds to the OpenSenseMap standards
 */
function prepareXL2Data(){
    // add the group code as first element
    const groupCode = {
        "sensor":"63c3f0c9a122c30008268cc1",
        "value": group_code
    }
    preparedXL2Data.push(groupCode);
    // add all the sound values to the Array
    xl2Tonspur.forEach(value => {
        const data = {
            "sensor":"63c3f0c9a122c30008268cc1",
            "value": value
        }
        preparedXL2Data.push(data);
    })
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
 * first max decible value down to 100 sound values
 * @param {Array} soundArray is the array that needs to be shortend
 */
function sliceSoundArray(soundArray) {
    const max = soundArrayMax(soundArray)
    if(soundArray[max] === undefined || soundArray[max+100] === undefined){
        console.error("Die Soundaufnahme ab dem Kalibrierungsstart ist zu kurz"); // Error handling
        // @todo  response auf der Website anzeigen
    }
    else{
        soundArray = soundArray.slice(max, max + 100) // shorten Array to 30 values
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
        body: JSON.stringify(preparedXL2Data)
    })
    .then(response => response.json())
    .then(response => console.log(JSON.stringify(response)))
}