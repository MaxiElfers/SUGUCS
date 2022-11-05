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

// für jeden Marker (geojson), also Messungen in der Datenbank ein Popup erstellen mit hilfe von
// forEach(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach?retiredLocale=de
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
});


// mithilfe von forEach für den Array der Marker (geojson) iterieren und dann jeden Wert mit DOM in die Tabelle einspeisen
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach?retiredLocale=de
// https://www.w3schools.com/jsref/met_table_insertrow.asp

geojson.forEach((marker, i = 0) => {
  i++;

  // Find a <table> element with id="dataTable":
  var dataTable = document.getElementById('dataTable');

  // Create an empty <tr> element and add it to the -1st position of the table:
  var row = dataTable.insertRow(-1);

  // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  var cell6 = row.insertCell(5);
  var cell7 = row.insertCell(6);
  var cell8 = row.insertCell(7);
  var cell9 = row.insertCell(8);

  // assigning the marker attributes to the cells
  cell1.innerHTML = marker.properties.name;
  cell2.innerHTML = marker.properties.time;
  cell3.innerHTML = marker.properties.timespan;
  cell4.innerHTML = marker.properties.fre;
  cell5.innerHTML = marker.properties.react;
  cell6.innerHTML = marker.properties.leq;;
  cell7.innerHTML = marker.properties.lmin;
  cell8.innerHTML = marker.properties.lmax;
  cell9.innerHTML = marker.properties.lpeak;
});
