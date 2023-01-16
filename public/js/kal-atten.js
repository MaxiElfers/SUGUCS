/***** all getElements *****/
let btn_Gcal = document.getElementById("btn_Gruppenkalibrierung");
let btn_Cal = document.getElementById("btn_Kalibrierung");
let in_GroupCode = document.getElementById("input_GroupCode");
let output_error_cal = document.getElementById("output_Error_Cal");
let output_error_down = document.getElementById("output_Error_Down");
let output_error_spin = document.getElementById("output_Error_Spin");

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
let soundArray = [71, 56, 55, 55, 57, 56, 56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57]

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
 */
function estimateAllDelta(){
    let meanDelta = 0;
    // calculates the mean delta
    deltaArr.forEach(delta =>{
        meanDelta += delta;
    })
    meanDelta = meanDelta / deltaArr.length;
    // adds mean delta to all unknown values
    for(var i = 0; i < 121; i++){
        if(allDeltas[i] === undefined){
            allDeltas[i] = meanDelta;
        }
    }
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
        lengthTheCalibration: "12 secounds"
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
        // Filter die letzten 100 Einträge heraus
        for(let i = 0; i < 101; i++) {
            xl2Array.push(parseInt(data[i].value))
        }
        console.log(xl2Array)
        if(xl2Array[0] === group_code){
            xl2Array = xl2Array.slice(1,101)
            console.log(xl2Array);
            btn_Gcal.classList.remove("btn-primary");
            btn_Cal.classList.remove("btn-success");
            output_error_down.classList.remove("text-danger");
            output_error_spin.classList.remove("visually-hidden");
            btn_Cal.classList.add("btn-secondary");
            btn_Cal.classList.add("disabled");
            btn_Gcal.classList.add("btn-secondary");
            btn_Gcal.classList.add("disabled");
            output_error_down.classList.add("text-success");
            output_error_cal.innerHTML = "";
            output_error_down.innerHTML = "Kalibrierungsraum " + group_code + " wurde gefunden! Vorgang läuft ... ";
            calibration(xl2Array, soundArray);
            estimateAllDelta();
            createCalibrationObject();
            console.log(calibrationObject);
            output_error_spin.classList.add("visually-hidden");
            output_error_down.innerHTML = "Kalibrierungsraum " + group_code + " wurde gefunden! Die Kalibrierung wurde abgeschlossen.";
        }
        else{
            output_error_down.innerHTML = "Zu dem angegebenen Code konnte kein Raum gefunden werden";
        }
    })
}