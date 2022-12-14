let output_error = document.getElementById("output_Error");
let btn_Gcal = document.getElementById("btn_Gruppenkalibrierung");
btn_Gcal.addEventListener("click", function(){checkError("group");});
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