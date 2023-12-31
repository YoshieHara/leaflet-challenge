// get GeoJSON end point with d3
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

d3.json(url).then(function(data) {
  // create map 
  var myMap = L.map("map", {
    center: [37.7749, -110.4194],
    zoom: 4.5
  });

  console.log(data);

  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  // Loop through the earthquake data and features
  data.features.forEach(function(feature) {
    // Get the latitude, longitude, magnitude, and depth of the earthquake
    var latitude = feature.geometry.coordinates[1];
    var longitude = feature.geometry.coordinates[0];
    var magnitude = feature.properties.mag;
    var depth = feature.geometry.coordinates[2];

    // Create the markers for the earthquakes; plot by lat, long and adjust size and color based on mag. and depth
    var marker = L.circleMarker([latitude, longitude], {
      radius: getRadius(magnitude),
      fillColor: getColor(depth),
      color: "black",
      fillOpacity: 0.9,
      weight: 0.5
    }).addTo(myMap);

    // Add a popup with information about the earthquake
    var popupContent = "<strong>Magnitude:</strong> " + magnitude + "<br>" +
      "<strong>Depth:</strong> " + depth + "<br>" + "<strong>Place:</strong> " + feature.properties.place;
    marker.bindPopup(popupContent);
  });

  // Create and position legend 
  let legend = L.control({
    position: "bottomright"
  });

  // Add details to legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    div.style.backgroundColor = "#fff"; // add white background color
    let ranges = [-10, 10, 30, 50, 70, 90];
    let colors = [
      "#98EE00",
      "#D4EE00",
      "#EECC00",
      "#EE9C00",
      "#EA822C",
      "#EA2C2C"
    ];
    // Looping through our legend details to generate labels
    // Additional CSS code was added to style.css to accomodate colorscale
    for (let i = 0; i < ranges.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
        + ranges[i] + (ranges[i + 1] ? "&ndash;" + ranges[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Add legend to myMap
  legend.addTo(myMap);

  // Function to get the color based on depth
  function getColor(depth) {
    return depth < 10 ? "#98EE00" :
           depth < 30 ? "#D4EE00" :
           depth < 50 ? "#EECC00" :
           depth < 70 ? "#EE9C00" :
           depth < 90 ? "#EA822C" :
                         "#EA2C2C";
  }
  // Function to get the radius of marker based on magnitude
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }

});