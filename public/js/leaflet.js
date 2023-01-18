// Leaflet definieren
var map = L.map("map").setView([51.97, 7.62], 13);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Variablendefinition
let x = document.getElementById("demo");

/**
 * Funktion zum Ausgeben der Geolocation des Browsers
 * @returns {coordinates}
 */
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

let pos;
/**
 * Funktion zum Zeigen der Geolocation des Browsers auf der Karte
 * @param {coordinates} position
 */
function showPosition(position) {
  x.innerHTML =
    "Breitengrad: " +
    position.coords.latitude +
    ",  Längengrad: " +
    position.coords.longitude;
  pos = [position.coords.latitude, position.coords.longitude];

  // Marker auf der Leaflet erstellen
  var marker = new L.marker([pos[0], pos[1]]);
  marker.bindPopup("mein Standort");
  marker.addTo(map);
  map.setView([pos[0], pos[1]], 20);

  // ggf Button für Messung disablen
  if (osbDiv.value == "" || nameDiv.value == "") {
    messungButton.disabled = true;
  } else {
    messungButton.disabled = false;
  }
}
