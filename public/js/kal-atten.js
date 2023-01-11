/***** all getElements *****/
let output_error = document.getElementById("output_Error");
let btn_Gcal = document.getElementById("btn_Gruppenkalibrierung");
//let btn_calCom = document.getElementById("btn_calibrationComplete");

/***** all EventListeners ******/
btn_Gcal.addEventListener("click", function(){checkError("group");});
//btn_calCom.addEventListener("click", function(){estimateAllDelta();});

/***** all Variables ******/
let allDeltas = {};
let deltaArr = [];
const xl2Array = "?";
const userArray = "?";
let calibrationObject;


/***** all functionalities ******/

/**
 * tests that the preconditions are given, so 
 * the calibration can be done without a problem 
 * @param {*} art Array of which calibration method will be used
 */
 function checkError(art){
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
    for(var i = 0; i < 120; i++){
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