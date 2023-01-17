/***** all getElements *****/
let btn_Gcal = document.getElementById("btn_Gruppenkalibrierung");
let btn_Cal = document.getElementById("btn_Kalibrierung");
let in_GroupCode = document.getElementById("input_GroupCode");
let output_error_cal = document.getElementById("output_Error_Cal");
let output_error_down = document.getElementById("output_Error_Down");
let output_error_spin = document.getElementById("output_Error_Spin");
let out_fin = document.getElementById("out_finished");

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
                console.error(allDeltas[i]);
            }
            allDeltas[i] = +allDeltas[i].toFixed(2); // rounds the delta down to two after komma numbers
            helpVar++;
        }
    })
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
        lengthTheCalibration: "10 secounds"
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
            xl2Array = xl2Array.slice(1,101);
            btn_Gcal.classList.remove("btn-primary");
            btn_Cal.classList.remove("btn-success");
            output_error_down.classList.remove("text-danger");
            btn_Cal.classList.add("btn-secondary", "disabled");
            btn_Gcal.classList.add("btn-secondary", "disabled");
            output_error_down.classList.add("text-success");
            output_error_cal.innerHTML = "";
            calibration(xl2Array, soundArray);
            estimateAllDelta();
            createCalibrationObject();
            console.log(calibrationObject);
            out_fin.classList.remove("visually-hidden");
        }
        else{
            output_error_down.innerHTML = "Zu dem angegebenen Code konnte kein Raum gefunden werden";
        }
    })
}