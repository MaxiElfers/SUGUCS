/***** all getElements *****/
let btn_calibration = document.getElementById("btn_Kalibrierung");
let input_GroupCode = document.getElementById("input_GroupCode");
let output_error = document.getElementById("output_Error");
let btn_Gcal = document.getElementById("btn_Gruppenkalibrierung");
let in_file = document.getElementById("in_file");
let btn_xl2 = document.getElementById("btn_XL2");
let in_soundArray = document.getElementById("soundArray")

/***** all EventListeners ******/
btn_Gcal.addEventListener("click", function(){checkError("group");});
btn_xl2.addEventListener("click", function(){window.location = '/kalibrierung/XL2';});

/***** all Variables ******/
const audio_calibration = new Audio('/sounds/Calibration_sound.mpeg');
let xl2Tonspur = in_soundArray.innerHTML.split(',');
let counter = 0;


/***** all functionalities ******/

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
    audio_calibration.play();
}


// @ToDo: Funktion übersichtlicher schreiben und ordentliche Error behandlung einbauen
/**
 * Finds the maximum db value from the given
 * sound array
 * @param {Array} tonspur 
 */
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
  
/**
 * Shortens the sound array to match the length of the recorded one
 * @param {Number} max 
 * @param {Array} tonspur 
 */
function tonspurKuerzen(max, tonspur) {
  console.log("Bereit zum kuerzen")
  // Array kürzen auf richtige Länge
  tonspur = tonspur.slice(max, max + 30)
  console.log(tonspur)
}