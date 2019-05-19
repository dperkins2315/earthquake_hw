// Creating map object
var myMap = L.map("map", {
  center: [36.1699, -115.1398],
  zoom: 4
});

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// Store API query variables
var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Grab the data with d3
d3.json(baseURL, function(response) {

  // Create a new marker cluster group
  var markers = L.layerGroup();
  var data = response.features;

// colr the markers 
  function Colors(mag){
    mag = +mag;
    if (mag > 5){
      color = "red";
    }
    else if (mag >= 4){
      color = "orangeRed";
    }
    else if (mag >= 3){
      color = "orange";
    }
    else if (mag >= 2){
      color = "yellow";
    }
    else if (mag >= 1){
      color = "yellowgreen";
    }
    else{
      color = "green";
    }
    return color;
  }

  // Loop through data
  for (var i = 0; i < data.length; i++) {

    // Set the data location property to a variable
    var location = data[i].geometry;
    var properties = data[i].properties;

    // Check for location property
    if (location) {

      // Add a new marker to the cluster group and bind a pop-up
      var colorMarkers = Colors(properties.mag);
      markers.addLayer(L.circleMarker([location.coordinates[1], location.coordinates[0]], {color:colorMarkers, fill:true, fillcolor:colorMarkers, radius:properties.mag*7, fillOpacity: .7})
        .bindPopup(properties.place));
    }
  }

  // Add our marker cluster layer to the map
  myMap.addLayer(markers);

// create the legend for the earthquakes
var legend = L.control({
  position: "bottomleft"
});

legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'legend');
  magnitude = [0, 1, 2, 3, 4, 5]
  colors = ["green", "yellowgreen", "yellow", "orange", "orangered", "red"]
  for (var i = 0; i < magnitude.length; i++) {
    div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " +
      magnitude[i] + (magnitude[i + 1] ? "&ndash;" + magnitude[i + 1] + "<br>" : "+");
  }
  return div;
}
legend.addTo(myMap);
});


