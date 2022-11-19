window.onload = function () {
    var map = L.map('analysemap').setView([51.96, 7.62], 12);

    L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

    var lautstärkedaten = {
        max: 8,
        data: [{
            lat: 51.96361471843619,
            lng: 7.613263440306753,
            leq: 33
        }, {
            lat: 51.969528599670866,
            lng: 7.59592634835127,
            leq: 69
        },
    {
            lat: 51.96328416661444,
            lng: 7.626824595101709,
            leq: 44
        },
    {
            lat: 51.95441521073917,
            lng: 7.626777444234705,
            leq: 40
        },
    {
            lat: 51.968847127728424,
            lng: 7.649246592247607,
            leq: 25
        },{
            lat: 51.981783956039294,
            lng: 7.615430767309618,
            leq: 88
        },
    {
            lat: 51.94312577098023,
            lng: 7.613099861371978,
            leq: 90
        },
    {
            lat: 51.966603084231934,
            lng: 7.566420566041046,
            leq: 100
        },
    {
            lat: 51.953605537296994,
            lng: 7.617354899306434,
            leq: 35
        },
    {
            lat: 51.96235426614382,
            lng: 7.640903164348117,
            leq: 56
        },
    {
            lat: 51.967539832319716,
            lng: 7.64965937842544,
            leq: 62
        },
    {
            lat: 51.96858734860393,
            lng: 7.6477041073208625,
            leq: 49
        },
    {
            lat: 51.966701801663675,
            lng: 7.648044154469915,
            leq: 12
        },
    {
            lat: 51.97450535564653,
            lng: 7.568728157053158,
            leq: 98
        },
    {
            lat: 51.965758998444926,
            lng: 7.567963050968075,
            leq: 72
        }]
    };

    var cfg = {
        // radius should be small ONLY if scaleRadius is true (or small radius is intended)
        "radius": 0.01,
        "maxOpacity": .2,
        // scales the radius based on map zoom
        "scaleRadius": true,
        // if set to false the heatmap uses the global maximum for colorization
        // if activated: uses the data maximum within the current map boundaries
        //   (there will always be a red spot with useLocalExtremas true)
        "useLocalExtrema": true,
        // which field name in your data represents the latitude - default "lat"
        latField: 'lat',
        // which field name in your data represents the longitude - default "lng"
        lngField: 'lng',
        // which field name in your data represents the data value - default "value"
        valueField: 'leq'
    };

    var heatmapLayer = new HeatmapOverlay(cfg).addTo(map);
    heatmapLayer.setData(lautstärkedaten);

    var baseLayer={map};
    var overlays={heatmapLayer};

    L.control.layers(null, overlays).addTo(map);
}