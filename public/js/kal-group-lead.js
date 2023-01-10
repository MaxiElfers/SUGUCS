/***** all getElements *****/
let btn_calibration = document.getElementById("btn_Kalibrierung");
let input_GroupCode = document.getElementById("input_GroupCode");
let output_error = document.getElementById("output_Error");
let btn_Gcal = document.getElementById("btn_Gruppenkalibrierung");
let btn_recording = document.getElementById("btn_recording");
let in_file = document.getElementById("in_file");
let btn_xl2 = document.getElementById("btn_XL2");
let in_soundArray = document.getElementById("soundArray")

/***** all EventListeners ******/
btn_Gcal.addEventListener("click", function(){checkError("group");});
btn_xl2.addEventListener("click", function(){window.location = '/kalibrierung/XL2';});
btn_recording.addEventListener("click", function(){playSound();});

/***** all Variables ******/
const audio_calibration = new Audio('/sounds/Calibration_sound.mpeg');
let xl2Tonspur = in_soundArray.innerHTML.split(',');
let counter = 0;


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
 * Shortens the sound array to match the length of the recorded one
 * @param {Array} tonspur 
 */
function tonspurKuerzen(tonspur) {
  console.log("Bereit zum kuerzen")
  // Array kürzen auf richtige Länge
  tonspur = tonspur.slice(0, 30) // @ToDo: Laenge noch anpassen
  console.log(tonspur)
}