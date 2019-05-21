// API
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// GET json
d3.json(queryUrl, function(data) {
  // createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // define function and popup
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + "Magnitude: " + (feature.properties.mag)+ "</p>");
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      function getColor(d) {
        return d > 6 ? '#800026' :
               d > 5  ? '#BD0026' :
               d > 4  ? '#E31A1C' :
               d > 3  ? '#FC4E2A' :
               d > 2   ? '#FD8D3C' :
               d > 1   ? '#FEB24C' :
                          '#FFEDA0';
      }
  
      var geojsonMarkerOptions = {
        radius: feature.properties.mag*4,
        fillColor: getColor(feature.properties.mag),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    },
    onEachFeature: onEachFeature
  });

  // createthe map
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // define streetmap
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // basemap layer
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // overlay
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // map center
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // create and pass layer
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


var legend = L.control({position: 'bottomright'});

function getColor(d) {
  return d > 6 ? '#800026' :
         d > 5  ? '#BD0026' :
         d > 4  ? '#E31A1C' :
         d > 3  ? '#FC4E2A' :
         d > 2   ? '#FD8D3C' :
         d > 1   ? '#FEB24C' :
                    '#FFEDA0';
}
legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5, 6],
        labels = [];

    // loop through to make markers
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
}
