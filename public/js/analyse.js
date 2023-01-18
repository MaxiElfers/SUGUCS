var map = L.map('analysemap').setView([51.919, 7.5], 12);

L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


let lautstärken = []
let dbwithtime = []

function fetchbox() {
    let SBID = document.getElementById("userInput").value;
    console.log(SBID)
    fetch(`https://api.opensensemap.org/boxes/${SBID}?format=geojson`).then(function (response) {
        return response.json();
        console.log(SBID)
    }).then(function (data) {
        console.log(data);
        console.log(JSON.stringify(data));

        // spezielles Design für die Marker der Messungen
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
                layer.bindPopup(feature.properties.name)

            }
        }).addTo(map);

        var baseLayer = {
            map
        };
        var overlays = {
            boxvisualisierung
        };

        //layerControl.addOverlay(boxvisualisierung, 'Boxstandort');// spezielles Design für die Marker der Messungen
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
                layer.bindPopup(feature.properties.name)

            }
        }).addTo(map);


    }).catch(function (err) {
        console.log('Fetch Error :', err);
    })

    // test box: Senden: 60f077874fb91e001c71b3b1 TestBox: 63c3f0c9a122c30008268cc0
    // test sensor: Senden: 60f077874fb91e001c71b3b2 TestBox: 63c3f0c9a122c30008268cc1
    // Beispielzeiten: 2022-11-22T08:00 und 2022-11-22T12:00
    let SID = document.getElementById("sid").value;
    let starttime = document.getElementById("starttimeInput").value;
    let endtime = document.getElementById("endtimeInput").value;
    console.log(SBID)
    console.log(SID)
    if (starttime == 0) {
        fetch(`https://api.opensensemap.org/boxes/${SBID}/data/${SID}`).then(function (response) {
            return response.json();
        }).then(function (dbdata) {
            console.log(dbdata);
            // Filter die letzten x Einträge heraus
            for (let i = 0; i < dbdata.length; i++) {

                lautstärken.push(dbdata[i].createdAt + ": " + dbdata[i].value)
            }
            console.log(lautstärken)

            //document.getElementById("elements").innerHTML = JSON.stringify(lautstärken);

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

            // export as json
            var boxinfos = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dbdata));
            var a = document.createElement('a');
            a.href = boxinfos;
            a.download = 'boxinfos.json';
            a.innerHTML = "Herunterladen als JSON"

            var containerjson = document.getElementById('containerjson');
            containerjson.appendChild(a);

        });
    } else {
        //function fetchboxtime() {
        fetch(`https://api.opensensemap.org/boxes/${SBID}/data/${SID}?from-date=${starttime}:00Z&to-date=${endtime}:00Z&format=json`).then(function (response) {
            return response.json();
        }).then(function (timedata) {
            console.log(timedata);
            // Filter die letzten x Einträge heraus
            for (let i = 0; i < timedata.length; i++) {

                dbwithtime.push(timedata[i].createdAt + ": " + timedata[i].value)
            }
            console.log(timedata)

            //document.getElementById("elements").innerHTML = JSON.stringify(dbwithtime);
            drawTable(timedata)
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
            
            // export as json
            var boxinfos = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(timedata));
            var a = document.createElement('a');
            a.href = boxinfos;
            a.download = 'boxinfos.json';
            a.innerHTML = "Herunterladen als JSON"

            var containerjson = document.getElementById('containerjson');
            containerjson.appendChild(a);
        });
        //}
    }
}
