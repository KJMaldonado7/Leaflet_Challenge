// Create the map
let map = L.map('map').setView([39.828175, -98.5795], 4);

// Create tile layer
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Add "streetmap" tile layer to the map.
streetmap.addTo(map);

// Load GeoJSON data
let geoData = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

// Get data with D3
d3.json(geoData).then(function(data) {
    // Create layer for markers
    let geojson = L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, createMarkerStyle(feature));
        },
        onEachFeature: bindPopup
    }).addTo(map);


// Add legend
let legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend'),
        depths = [-10, 10, 30, 50, 70, 90];

    // White background and black text color
    div.style.backgroundColor = 'white';
    div.style.color = 'black';
    div.style.padding = '5px';
    div.style.border = '1px solid #ccc';

    // Legend title
    div.innerHTML = '<h1>Earthquake Depth</h1>';

    // Make labels
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<li style="background:' + getColor(depths[i]) + '"></li> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);

});

// Function to get color based on depth
const getColor = depth => {
    return depth >= 90 ? '#e51f1f' :
           depth >= 70 ? '#FF4433' :
           depth >= 50 ? '#f2a134' :
           depth >= 30 ? '#f7e379' :
           depth >= 10 ? '#bbdb44' :
                         '#44ce1b'; 
};

// Function to get radius based on magnitude
const getRadius = magnitude => magnitude * 3;

// Function to create marker style
const createMarkerStyle = feature => ({
    radius: getRadius(feature.properties.mag),
    fillColor: getColor(feature.geometry.coordinates[2]),
    color: '#000',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
});

// Function to bind popups
const bindPopup = (feature, layer) => {
    layer.bindPopup(`<strong>Location:</strong> ${feature.properties.place}<br>
                     <strong>Magnitude:</strong> ${feature.properties.mag}<br>
                     <strong>Depth:</strong> ${feature.geometry.coordinates[2]} km`);
};
