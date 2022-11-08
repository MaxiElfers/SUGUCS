var lang = document.getElementById("long");
var breit = document.getElementById("lat");
let upload = document.getElementById("upload")
let textarea = document.getElementById('textarea');

// Event zum lesen der hochgeladenen Datei und einfügen dieser in die textarea zum hinzufügen zur Datenbank
upload.addEventListener('change', function(){
104
  // 4010if a file was selected
  if (upload.files.length > 0) 
  {
  var reader = new FileReader() // File reader to read the file 

  reader.readAsText(upload.files[0]); // read the uploaded file
  
  // event listener, if the reader has read the file
  reader.addEventListener('load', function() {
      
      var result = JSON.parse(reader.result)
      var str = JSON.stringify(result, undefined, 4);
      textarea.value = str;
  })
}
})

// erstellen einer leaflet Karte mit Europa als Startpunkt und mit OSM als Basiskarte
var map = L.map("map").setView([51.96, 7.6], 12);

L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// ab hier hinzufügen von Leaflet draw
// siehe: https://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// draw Control 
var drawControl = new L.Control.Draw({
  edit: {
    edit: false,
    remove: true,
    featureGroup: drawnItems,
  },
  draw: {
    polyline: false,
    rectangle: false,
    circle: false,
    circlemarker: false,
    polygon: false,
    marker: true,
  },
});
map.addControl(drawControl);

// hinzufügen der gezeichneten Punkte zur leaflet Karte durch Events
map.on(L.Draw.Event.CREATED, function (e) {
  var marker = e.layer;
  drawnItems.addLayer(marker);
  var draws = drawnItems.toGeoJSON();
  var coordinates = e.layer.getLatLng();
  lang.value = coordinates.lng;
  breit.value = coordinates.lat;
});

map.on("draw:deleted", function (e) {
  map.removeControl(drawControl);
  map.addControl(drawControl);
});

