let btn_calibration = document.getElementById("btn_Kalibrierung");
let input_GroupCode = document.getElementById("input_GroupCode");
let output_error = document.getElementById("output_Error");
let btn_Scal = document.getElementById("btn_Einzelkalibrierung");
let btn_Gcal = document.getElementById("btn_Gruppenkalibrierung");
let btn_recording = document.getElementById("btn_recording");

btn_Gcal.addEventListener("click", function(){checkError("group");});
btn_Scal.addEventListener("click", function(){checkError("single");});
btn_recording.addEventListener("click", function(){playSound();});

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

function playSound(){
    audio_schwan.play();
}

function startDEMO(){
    console.clear();
    console.log("Entgegengenommen Daten", gelieferteDaten1);
    console.log("Reference Daten", referenceDaten1)
    multiDeltaKali();
    console.log("Erstelltes Delta:", multiDelta);
}

function startCalDEMO(mode){
    console.clear();
    let spur = [];
    spur.push(parseInt(input1.value));
    spur.push(parseInt(input2.value));
    console.log(spur);
    deltaAnwenden(mode, spur);
    console.log(spur);
}



let referenceDaten1 = [10, 40];
let referenceDaten2 = [4, 7];
let referenceDaten3 = [20, 31];
let gelieferteDaten1 = [4, 42];
let gelieferteDaten2 = [5, 10];
let gelieferteDaten3 = [24, 30];
let singleDelta = 0;
let multiDelta = [];

/**
 * function starts the system
 */
function startSystem(){
    // to-do: Wert bekommen
    console.clear();
    console.log("Entgegengenommen Daten", gelieferteDaten1);
    console.log("Reference Daten", referenceDaten1)
    calibration();
    console.log("Erstelltes Delta:", singleDelta);
}

/**
 * function to start the system when data is given from the user
 */
function startSystemWithInputData() {
    gelieferteDaten1 = input_user.value;
    console.log("Entgegengenommen Daten", gelieferteDaten1);
    console.log("Reference Daten", referenceDaten1)
    calibration();
    console.log("Erstelltes Delta:", singleDelta);
}
/**
 * Starts the calibration process
 * Maybe you can choose the method of the
 * calibration
 */
function calibration(){
    let lieferStack = [gelieferteDaten1, gelieferteDaten2, gelieferteDaten3];
    let referStack = [referenceDaten1, referenceDaten2, referenceDaten3];
    oneDeltaKali(referenceDaten1, gelieferteDaten1);
}

/**
 * This function averages the check array
 * and the array to calibrate and calculates 
 * one single delte which then will be used to
 * add onto the whole array
 * @param {Array} 
 * @param {Array} 
 */
function oneDeltaKali(referenceAry, geliefertAry){
    let reference = ArrayAvg(referenceAry);
    let geliefert = ArrayAvg(geliefertAry);

    singleDelta = reference - geliefert;
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
 * !!!ACHTUNG!!! funktioniert noch nicht
 * @param {*} referenceStack 
 * @param {*} geliefertStack 
 */
function multiReferenceDeltaKali(referenceStack, geliefertStack){
    let deltaArray = [];
    let hilfsArray = [];
    geliefertStack.forEach((Daten, index) => {
        let hilfsArrayReference = referenceStack[index];
        Daten.forEach((dat, index) => {
            hilfsArray[index] = hilfsArrayReference[index] - dat;
        })
        deltaArray[index] = hilfsArray;
    })
    console.log(deltaArray)
}

/**
 * Berechnet durchschnitt der Übergebenen Array
 * @param {Array} myArray 
 * @returns number
 */
function ArrayAvg(myArray) {
    let i = 0, summ = 0, ArrayLen = myArray.length;
    while (i < ArrayLen) {
        summ = summ + myArray[i++];
    }
    return summ / ArrayLen;
}




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