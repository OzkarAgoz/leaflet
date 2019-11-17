// Storing API endpoint into queryURL
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
var tectonicPlatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Get data
d3.json(earthquakeURL, function(data) {
    createFeatures(data.features);
});
// Define function to run on each feature 
function createFeatures(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +"</h3><h3>Location: "+ feature.properties.place +
              "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
          },

          pointToLayer: function (feature, latlng) {
            return new L.circle(latlng,
              {radius: getRadius(feature.properties.mag),
              fillColor: getColor(feature.properties.mag),
              fillOpacity: .6,
              color: "#black",
              stroke: true,
          })
        }
        });

    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define map layers with app_id  and app_code
    var navmap = L.tileLayer("https://api.mapbox.com/styles/v1/ozkar/ck2z6q6h72eyd1cmtm084dkrh/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoib3prYXIiLCJhIjoiY2sydjVkYmFyMDB6MjNobzN5d3h0YWo0dyJ9.bmh0jz1RRr2djPQTiM0T1Q");
    var litemap = L.tileLayer("https://api.mapbox.com/styles/v1/ozkar/ck338vx0m00561cqrcw9303pz/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoib3prYXIiLCJhIjoiY2sydjVkYmFyMDB6MjNobzN5d3h0YWo0dyJ9.bmh0jz1RRr2djPQTiM0T1Q");
    var nightMap = L.tileLayer("https://api.mapbox.com/styles/v1/ozkar/ck338jczq38j71cmv7fkmb7bc/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoib3prYXIiLCJhIjoiY2sydjVkYmFyMDB6MjNobzN5d3h0YWo0dyJ9.bmh0jz1RRr2djPQTiM0T1Q");
    
      // Define base maps
    var baseMaps = {
        "Night Map": nightMap,
        "Nav Map": navmap,
        "Lite Map": litemap
    };

    // Create tectonic layer
    var tectonicPlates = new L.LayerGroup();

    // Create overlay object to hold overlay layer
    var overlayMaps = {
        "Earthquakes": earthquakes,
        "Tectonic Plates": tectonicPlates
    };

    // Create map
    var myMap = L.map("map", {
        center: [33, -99],
        zoom: 4.1,
        layers: [nightMap, earthquakes, tectonicPlates]
    });

    // Add tectonic plates data
    d3.json(tectonicPlatesURL, function(tectonicData) {
        L.geoJson(tectonicData, {
            color: "red",
            weight: 3
        })
        .addTo(tectonicPlates);
    });

    //Add layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Create legend
    var legend = L.control({position: 'bottomleft'});

    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
        grades = [0, 1, 2, 3, 4, 5, 6];
    // loop to generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
    };
    legend.addTo(myMap);
}

// Pick color 
function getColor(magnitude) {
    if (magnitude > 6) {
        return 'darkred'
    } else if (magnitude > 5) {
        return 'red'
    } else if (magnitude > 4) {
        return 'orange'
    } else if (magnitude > 3) {
        return 'yellow'
    } else if (magnitude > 2) {
        return 'lightgreen'
    } else if (magnitude > 1) {
        return 'green'
    } else {
        return '#cyan'
    }
};

//Create radius function
function getRadius(magnitude) {
    return magnitude * 20000;
};