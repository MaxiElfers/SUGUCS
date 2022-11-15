let btn_calibrationSingle = document.getElementById("btn_Kalibrierung");
let btn_calibrationGroup = document.getElementById("btn_Gruppenkalibrierung");
let SAusgabe = document.getElementById("singleAusgabe");
let GAusgabe = document.getElementById("groupAusgabe");

let btnS_click = btn_calibrationSingle.addEventListener("click", function(){startSystem();});
let btnG_click = btn_calibrationGroup.addEventListener("click", function(){GAusgabe.innerHTML = "Es wurde noch keine Funktionalität erstellt"})


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
    console.log("Entgegengenommen Daten", gelieferteDaten1);
    console.log("Reference Daten", referenceDaten1)
    calibration();
    SAusgabe.innerHTML = "Erstelltes Delta: " +  singleDelta;
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
    gelieferteDaten.forEach((Wert, index) => {
        multiDelta[index] = referenceDaten[index] - Wert;
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

function ArrayAvg(myArray) {
    let i = 0, summ = 0, ArrayLen = myArray.length;
    while (i < ArrayLen) {
        summ = summ + myArray[i++];
    }
    return summ / ArrayLen;
}
