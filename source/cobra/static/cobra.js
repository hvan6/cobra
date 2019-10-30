var map;
var lalatlon = {lat:34.052235,lon:-118.243683};

function initMap() {
  // Create a styles array to use with the map.
  var styles = [
    {
      featureType: 'water',
      stylers: [
        { color: '#19a0d8' }
      ]
    },{
      featureType: 'administrative',
      elementType: 'labels.text.stroke',
      stylers: [
        { color: '#ffffff' },
        { weight: 6 }
      ]
    },{
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [
        { color: '#e85113' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        { color: '#efe9e4' },
        { lightness: -40 }
      ]
    },{
      featureType: 'transit.station',
      stylers: [
        { weight: 9 },
        { hue: '#e85113' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'labels.icon',
      stylers: [
        { visibility: 'off' }
      ]
    },{
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [
        { lightness: 100 }
      ]
    },{
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        { lightness: -100 }
      ]
    },{
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        { visibility: 'on' },
        { color: '#f0e4d3' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [
        { color: '#efe9e4' },
        { lightness: -25 }
      ]
    }
  ];

  // These are the real estate listings that will be shown to the user.
  // Normally we'd have these in a database instead.
  // define global
  locations = [
    {title: 'Los Angeles zip 90046', location: {lat: 34.098908, lng: -118.36241}, zhvi:1451500},
    {title: 'Los Angeles zip 90034', location: {lat: 34.03056, lng: -118.39804}, zhvi:1254900},
    {title: 'Los Angeles zip 90044', location: {lat: 33.953814, lng: -118.29158}, zhvi:444200},
    {title: 'Los Angeles zip 90026', location: {lat: 34.07851, lng: -118.26596}, zhvi:950000},
    {title: 'Los Angeles zip 90066', location: {lat: 34.002011, lng: -118.43083}, zhvi:1423900},
    {title: 'Los Angeles zip 90019', location: {lat: 34.048411, lng: -118.34015}, zhvi:1125200}
  ];
  //console.log("locations:");
  //console.log(locations);

  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: lalatlon.lat, lng: lalatlon.lon},
    zoom: 13,
    styles: styles,
    mapTypeControl: false
  });

  /*
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds =  map.getBounds();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();
    //do whatever you want with those bounds
    console.log("ne=" + ne + "- sw=" + sw);
  });
  */


  var largeInfowindow = new google.maps.InfoWindow();

  // Style the markers a bit. This will be our listing marker icon.
  var defaultIcon = makeMarkerIcon('0091ff');

  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  var highlightedIcon = makeMarkerIcon('FFFF24');

  //var largeInfowindow = new google.maps.InfoWindow();

  // Create a new blank array for all the listing markers.
  markers = [];

  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    var zhvi = locations[i].zhvi;
    // Create a marker per location, and put into markers array.

    // var marker = new google.maps.Marker({
    //   position: position,
    //   title: title,
    //   zhvi: zhvi,
    //   animation: google.maps.Animation.DROP,
    //   icon: defaultIcon,
    //   id: i
    // });

    var marker = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      //map: map,
      position: position,
      center: position,
      radius: Math.sqrt(zhvi),
      title: title,
      zhvi: zhvi
    });

    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', function() {
      //this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      //this.setIcon(defaultIcon);
    });
  }

  document.getElementById('show-listings').addEventListener('click', showListings);
  document.getElementById('hide-listings').addEventListener('click', hideListings);

} // end of initMap()

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + ': <br><b>$' +  marker.zhvi.toLocaleString() + '</b></div>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
  }
}

function showmedian() {
  var bounds = new google.maps.LatLngBounds();
  console.log(locations);
  for (var i = 0; i < locations.length; i++) {
    var position = locations[i].location;
    var zhvi = locations[i].zhvi;

    var cirle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      //map: map,
      center: position,
      radius: Math.sqrt(zhvi),
    });
    cirle.setMap(map);
  }
}

function hidemedian() {

}

// This function will loop through the markers array and display them all.
function showListings() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}
// This function will loop through the listings and hide them all.
function hideListings() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}
