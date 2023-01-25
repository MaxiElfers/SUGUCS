/**
 * @function hideLoadingElement
 * @desc hides the loading element as soon as the image is loaded
 * @param {*} 
 */
function hideLoadingElement() {
  document.getElementById("loading-element").classList.add("d-none");
}

// hinzufügen einer Karte über Leaflet
var map = L.map('analysemap').setView([51.919, 7.5], 10);

L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

// abrufen aller openSenseBoxen und hinzufügen zur Leaflet Karte
fetch("https://api.opensensemap.org/boxes?format=geojson").then(function (response) {
    return response.json();
}).then(function (locations) {
    console.log(locations);

    // spezielles Design für die Marker der Messungen
    var boxstandort = L.icon({
        iconUrl: 'images/boxmarker.png',
        iconSize: [30, 30], // size of the icon
        iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
        popupAnchor: [-5, -10] // point from which the popup should open relative to the iconAnchor
    });

    var boxvisualisierung = new L.geoJSON(locations, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: boxstandort
            });
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup("Sensebox Name: " + feature.properties.name + "<br>" + "SenseBox ID: " + feature.properties._id)

        }
    }).addTo(map);
}).catch(function (err) {
    console.log('Fetch Error :', err);
})

/**
 * @function fetchbox
 * @desc fetches data with the given user input as wildcards
 * @param {*} 
 */
function fetchbox() {
    let SBID = document.getElementById("userinput").value;
    console.log(SBID)
    fetch(`https://api.opensensemap.org/boxes/${SBID}?format=geojson`).then(function (response) {
        return response.json();
        console.log(SBID)
    }).then(function (data) {
        console.log(data);
        console.log(JSON.stringify(data));

        // spezielles Design für die Marker der Boxstandorte
        var boxstandort = L.icon({
            iconUrl: 'images/boxmarker.png',
            iconSize: [30, 30], // size of the icon
            iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
            popupAnchor: [-5, -10] // point from which the popup should open relative to the iconAnchor
        });

        var boxvisualisierung = new L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {
                    icon: boxstandort
                });
            },

            onEachFeature: function (feature, layer) {
                layer.bindPopup("Sensebox Name: " + feature.properties.name + "<br>" + "SenseBox ID: " + feature.properties._id)

            }
        }).addTo(map);


    }).catch(function (err) {
        console.log('Fetch Error :', err);
    })

    let starttime = document.getElementById("starttimeInput").value;
    let endtime = document.getElementById("endtimeInput").value;
    console.log(SBID)
    if (starttime == 0 || endtime == 0) {
        // wenn Start und Endzeit nicht gegeben sind:
        fetch(`https://api.opensensemap.org/boxes/data?boxId=${SBID}&phenomenon=Lautst%C3%A4rke&format=json`).then(function (response) {
            return response.json();
        }).then(function (dbdata) {
            console.log(dbdata);

            clearTable("resultTable")
            drawTable(dbdata)
            /**
             * @function drawTable
             * @desc inserts the fetched data into the table thats displayed on the page
             * @param {*} results array of JSON wich containes the data to be displayed
             */
            function drawTable(results) {
                var table = document.getElementById("resultTable");
                //creates the Table with the direction an distances
                for (var j = 0; j < results.length; j++) {
                    var newRow = table.insertRow(j + 1);
                    var cel1 = newRow.insertCell(0);
                    var cel2 = newRow.insertCell(1);
                    cel1.innerHTML = dbdata[j].createdAt;
                    cel2.innerHTML = dbdata[j].value;
                }
            }
            /**
             * clearTable
             * @desc removes all table entries and rows except for the header.
             * @param tableID the id of the table to clear
             */
            function clearTable(tableID) {
                //remove all table rows
                var tableHeaderRowCount = 1;
                var table = document.getElementById(tableID);
                var rowCount = table.rows.length;
                for (var i = tableHeaderRowCount; i < rowCount; i++) {
                    table.deleteRow(tableHeaderRowCount);
                }
            }

            // herunterladen als CSV Datei über DOM
            var csv = dbdata.map(row => Object.values(row).join(",")).join("\n");
            var filename = "Lautstärkedaten.csv";
            var blob = new Blob([csv], {
                type: "text/csv"
            });
            var link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.innerHTML = "Herunterladen als CSV Datei<br>"
            var containercsv = document.getElementById('containercsv');
            containercsv.appendChild(link);


            // herunterladen als json Datei über DOM
            var boxinfos = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dbdata));
            var a = document.createElement('a');
            a.href = boxinfos;
            a.download = 'Lautstärkedaten.json';
            a.innerHTML = "Herunterladen als JSON Datei <br>"
            var containerjson = document.getElementById('containerjson');
            containerjson.appendChild(a);


            // löscht den Array, damit bei einer erneuten Abfrage nur die neue Abfrage im Array ist
            for (let i = 0; i < dbdata.length; i++) {
                delete dbdata[i]
            }
            console.log(dbdata)

        });
    } else {
        // Wenn Start und Endzeit angegeben wurde werden diese in der Anfrage an die opensensemap API berücksichtigt
        fetch(`https://api.opensensemap.org/boxes/data?boxId=${SBID}&from-date=${starttime}:00Z&to-date=${endtime}:00Z&phenomenon=Lautst%C3%A4rke&format=json`).then(function (response) {
            return response.json();
        }).then(function (timedata) {
            console.log(timedata);
            clearTable("resultTable")

            drawTable(timedata)
            /**
             * @function drawTable
             * @desc inserts the fetched data into the table thats displayed on the page;
             * @param {*} results array of JSON wich containes the data to be displayed
             */
            function drawTable(results) {
                var table = document.getElementById("resultTable");
                //creates the Table with the direction an distances
                for (var j = 0; j < results.length; j++) {
                    var newRow = table.insertRow(j + 1);
                    var cel1 = newRow.insertCell(0);
                    var cel2 = newRow.insertCell(1);
                    cel1.innerHTML = timedata[j].createdAt;
                    cel2.innerHTML = timedata[j].value;
                }
            }
            /**
             * clearTable
             * @desc removes all table entries and rows except for the header.
             * @param tableID the id of the table to clear
             */
            function clearTable(tableID) {
                //remove all table rows
                var tableHeaderRowCount = 1;
                var table = document.getElementById(tableID);
                var rowCount = table.rows.length;
                for (var i = tableHeaderRowCount; i < rowCount; i++) {
                    table.deleteRow(tableHeaderRowCount);
                }
            }

            // herunterladen als CSV Datei über DOM
            var csv = timedata.map(row => Object.values(row).join(",")).join("\n");
            var filename = "Lautstärkedaten.csv";
            var blob = new Blob([csv], {
                type: "text/csv"
            });
            var link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.innerHTML = "Herunterladen als CSV Datei<br>"
            var containercsv = document.getElementById('containercsv');
            containercsv.appendChild(link);


            // herunterladen als json Datei über DOM
            var boxinfos = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(timedata));
            var a = document.createElement('a');
            a.href = boxinfos;
            a.download = 'Lautstärkedaten.json';
            a.innerHTML = "Herunterladen als JSON Datei <br>"
            var containerjson = document.getElementById('containerjson');
            containerjson.appendChild(a);

            // deletes the content of the given array
            for (let i = 0; i < timedata.length; i++) {
                delete timedata[i]
            }
            console.log(timedata)
        });
        
    }
}
