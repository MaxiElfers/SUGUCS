let btn_calibration = document.getElementById("btn_Kalibrierung");
let btn_click = btn_calibration.addEventListener("click", function(){startSystem();});
let btn_calibration_with_input = document.getElementById("btn_Kalibrierung_mit_Input");
let btn_click_with_input = btn_calibration_with_input.addEventListener("click", function(){startSystemWithInputData();});
let input_for_calibration = document.getElementById("input_Array").value;


let referenceDaten1 = [10, 40];
let referenceDaten2 = [4, 7];
let referenceDaten3 = [20, 31];
let gelieferteDaten1 = [5, 34];
let gelieferteDaten2 = [5, 10];
let gelieferteDaten3 = [24, 30];
let singleDelta = 0;
let multiDelta = [];

/**
 * function starts the system
 */
function startSystem(){
    // to-do: Wert bekommen
    
    calibration();
}

/**
 * function to start the system when data is given from the user
 */
function startSystemWithInputData() {
    console.log(gelieferteDaten1)
    gelieferteDaten1 = input_for_calibration;
    console.log(gelieferteDaten1)
    calibration();
}
/**
 * Starts the calibration process
 * Maybe you can choose the method of the
 * calibration
 */
function calibration(){
    let lieferStack = [gelieferteDaten1, gelieferteDaten2, gelieferteDaten3];
    let referStack = [referenceDaten1, referenceDaten2, referenceDaten3];
    multiReferenceDeltaKali(referStack, lieferStack );
}

/**
 * This function averages the check array
 * and the array to calibrate and calculates 
 * one single delte which then will be used to
 * add onto the whole array
 */
function oneDeltaKali(){
    let reference = ArrayAvg(referenceDaten);
    let geliefert = ArrayAvg(gelieferteDaten);

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
    gelieferteDaten.forEach((Wert, index) => {
        multiDelta[index] = referenceDaten[index] - Wert;
    })
}

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

function ArrayAvg(myArray) {
    let i = 0, summ = 0, ArrayLen = myArray.length;
    while (i < ArrayLen) {
        summ = summ + myArray[i++];
    }
    return summ / ArrayLen;
}
