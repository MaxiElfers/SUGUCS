let btn_Kalibrierung = document.getElementById("btn_Kalibrierung");
let btn_click = btn_Kalibrierung.addEventListener("click", function(){startSystem();});

let referenceDaten = [10, 40];
let gelieferteDaten = [5, 34];
let newData = [];

function startSystem(){
    // to-do: Wert bekommen

    kalibrierung();
    console.log(newData)
}

function kalibrierung(){
    var reference = ArrayAvg(referenceDaten);
    var geliefert = ArrayAvg(gelieferteDaten);

    var delta = reference - geliefert

    gelieferteDaten.forEach((Wert, index) => {
        newData[index] = Wert + delta;
    });
}

function ArrayAvg(myArray) {
    var i = 0, summ = 0, ArrayLen = myArray.length;
    while (i < ArrayLen) {
        summ = summ + myArray[i++];
    }
    return summ / ArrayLen;
}