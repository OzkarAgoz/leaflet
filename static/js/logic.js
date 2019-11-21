//  API queryURL and Getdata
var earthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(earthquakes, function(data) {
    createFeatures(data.features);
});
//  function to run on each feature 
function createFeatures(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function(feature, layer) {
        layer.bindPopup("<p>" + "<center>" + feature.properties.mag + "<center>"+ "<p>" + new Date(feature.properties.time) + "</p>");  },

          pointToLayer: function (feature, latlng) {
            return new L.circle(latlng,
              {radius: getRadius(feature.properties.mag),
              fillColor: getColor(feature.properties.mag),
              color: "#black",
              stroke: true,     })  }  });

    createMap(earthquakes);             }

function createMap(earthquakes) {

    //  map layers with app_id  and app_code
    var navmap = L.tileLayer("https://api.mapbox.com/styles/v1/ozkar/ck2z6q6h72eyd1cmtm084dkrh/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoib3prYXIiLCJhIjoiY2sydjVkYmFyMDB6MjNobzN5d3h0YWo0dyJ9.bmh0jz1RRr2djPQTiM0T1Q");
    var litemap = L.tileLayer("https://api.mapbox.com/styles/v1/ozkar/ck338vx0m00561cqrcw9303pz/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoib3prYXIiLCJhIjoiY2sydjVkYmFyMDB6MjNobzN5d3h0YWo0dyJ9.bmh0jz1RRr2djPQTiM0T1Q");
    var nightMap = L.tileLayer("https://api.mapbox.com/styles/v1/ozkar/ck338jczq38j71cmv7fkmb7bc/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoib3prYXIiLCJhIjoiY2sydjVkYmFyMDB6MjNobzN5d3h0YWo0dyJ9.bmh0jz1RRr2djPQTiM0T1Q");
    
      //  base maps and tectonic major plate layers
    var baseMaps = {"Night Map": nightMap, "Nav Map": navmap,"Lite Map": litemap     };
    var overlays = {"Earthquakes": earthquakes};

    //  map
    var MM = L.map("map", {zoom: 4.3, center: [33, -99], layers: [nightMap, earthquakes]});

    // Add plates data

    //Add layer control and legend
    L.control.layers(baseMaps, overlays).addTo(MM);
    var legend = L.control({position: 'bottomleft'});

    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
        grades = [0, 1, 2, 3, 4, 5, 6];
    // label colored box for Magnitude 
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
return div;};
    legend.addTo(MM);
}

//  colors 
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

// radius to match magnitude and enlarge by 20k
function getRadius(magnitude) {
    return magnitude * 20000;
};