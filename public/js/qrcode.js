let btn_scannen = document.getElementById("btn_QRScannen");
let btn_gruppeErstellen = document.getElementById("btn_GruppeErstellen");

btn_gruppeErstellen.addEventListener("click",  function(){erstelleGruppe();});
btn_scannen.addEventListener("click",  function(){scanneQR();});

/**
 * Funktion greift auf Kamera zu
 * Liest den QR Code
 * trägt den Gruppencode in das Eingabefeld ein
 */
function scanneQR(){

}

/**
 * Funktion erstellt eine Zufällige sechsstellige Zahlenfolge, welche als Gruppencode fungiert.
 * Erstellt im selben Zug einen QR Code, der diese Zahlenfolge repräsentiert. (ggf. mit link, der direkt auf die Website führt)
 * Zeigt QR Code unter dem Button Gruppe hosten an. 
 */
function erstelleGruppe(){

}