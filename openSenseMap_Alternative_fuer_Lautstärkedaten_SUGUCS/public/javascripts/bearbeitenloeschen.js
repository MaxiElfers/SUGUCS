// erstellen einer leaflet Karte mit Europa als Startpunkt und mit OSM als Basiskarte
var map = L.map("map").setView([51.96, 7.6], 12);

L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// spezielles Design für die Marker der Messungen
var customLautstärkeIcon = L.icon({
    iconUrl: 'images/laut.png',
    iconSize: [50, 50], // size of the icon
    iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
    popupAnchor: [13, 0] // point from which the popup should open relative to the iconAnchor
  });

// popup größe regulieren
var customPoint = {
    'maxWidth': '500',
  }

// hinzufügen der Marker mit ihren Koordinaten und dem eigenem lautstärke Icon
geojson.forEach((marker) => {

    // https://stackoverflow.com/questions/36713284/adding-a-table-around-the-pop-up-information-in-leaflet
    let popupTabelle =
        "<table  class='table table-striped table-success table-hover'>" +
        "  <tr>" +
        "    <th>Name</th>" +
        "    <td>" +
        marker.properties.name +
        "</td>" +
        "  </tr>" +
        "  <tr>" +
        "    <th>Uhrzeit und Datum</th>" +
        "    <td>" +
        marker.properties.time +
        "</td>" +
        "  </tr>" +
        "  <tr>" +
        "    <th>Dauer der Messung (s)</th>" +
        "    <td>" +
        marker.properties.timespan +
        "</td>" +
        "  </tr>" +
        "  <tr>" +
        "    <th>Frequenzbewertung</th>" +
        "    <td>" +
        marker.properties.fre +
        "</td>" +
        "  </tr>" +
        "  <tr>" +
        "    <th>Reaktionszeit</th>" +
        "    <td>" +
        marker.properties.react +
        "</td>" +
        "  </tr>" +
        "  <tr>" +
        "    <th>Leq</th>" +
        "    <td>" +
        marker.properties.leq + 
        "</td>" +
        "  </tr>" +
        "  <tr>" +
        "    <th>Minimum</th>" +
        "    <td>" +
        marker.properties.lmin + 
        "</td>" +
        "  </tr>" +
        "  <tr>" +
        "    <th>Maximum</th>" +
        "    <td>" +
        marker.properties.lmax + 
        "</td>" +
        "  </tr>" +
        "  <tr>" +
        "    <th>Peak</th>" +
        "    <td>" +
        marker.properties.lpeak
        "</table>"

    var marker = L.marker([
        marker.geometry.coordinates[1],
        marker.geometry.coordinates[0],
    ], { icon: customLautstärkeIcon })
    marker.addTo(map)
    marker.bindPopup(popupTabelle, customPoint)
    marker.on("click", onClick);
});

/**
 * Dieses Event macht es möglich, dass ein Marker beim darauf klicken ausgewählt wird und die
 * Elemente zum löschen angezeigt werden
 * @param {*} e
 * @source: https://stackoverflow.com/questions/16927793/marker-in-leaflet-click-event
 * https://stackoverflow.com/questions/18382945/how-do-i-get-the-latlng-after-the-dragend-event-in-leaflet
 */
function onClick(e) {
    let messung = geojson.find((marker) => 
    marker.geometry.coordinates[0] == e.target._latlng.lng || 
    marker.geometry.coordinates[1] == e.target._latlng.lat);

    // Ausfüllen der Elemente zum bearbeiten unter der Karte
    document.getElementById("id").value = messung._id;
    document.getElementById("name").value = messung.properties.name;
    document.getElementById("time").value = messung.properties.time;
    document.getElementById("timespan").value = messung.properties.timespan;
    document.getElementById("long").value = messung.geometry.coordinates[0];
    document.getElementById("lat").value = messung.geometry.coordinates[1];
    document.getElementById("fre").value = messung.properties.fre;
    document.getElementById("react").value = messung.properties.react;
    document.getElementById("leq").value = messung.properties.leq;
    document.getElementById("lmin").value = messung.properties.lmin;
    document.getElementById("lmax").value = messung.properties.lmax;
    document.getElementById("lpeak").value = messung.properties.lpeak;
}

