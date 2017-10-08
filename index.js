'use strict'

// user require with a reference to bundle the file and use it in this file
// const example = require('./example')

// load manifests
// scripts
var map

function initMap () {
  findLocation()
    .then((loci) => {
      console.log(loci.location)
      doTheRest(loci)
    })

  function doTheRest (loci) {
    var geoLocal = new google.maps.LatLng(loci.location.lat, loci.location.lng)
    map = new google.maps.Map(document.getElementById('map'), {
      center: geoLocal,
      zoom: 13
    })
    var request = {
      location: geoLocal,
      radius: 7000,
      type: ['restaurant']
    }
    var service = new google.maps.places.PlacesService(map)
    service.nearbySearch(request, response)
  }
}

function findLocation () {
  return $.ajax({
    url: 'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyA1vdvU6w0bqLw1egqLckDf8RWbRHEeBWM',
    method: 'POST'
  })
}

function response (results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    var rando = Math.floor(Math.random() * results.length)
    createMarker(results[rando])
    console.log(results)
  } else {
    console.log(results, status)
  }
}

function createMarker (place) {
  var placeLoc = place.geometry.location
  var marker = new google.maps.Marker({
    position: placeLoc,
    map: map
  })
  let open = 'No'
  if (place.opening_hours.open_now) {
    open = 'Yes'
  }
  const contentString = '<h2>' + place.name + '</h2><p>Open now: ' + open + '</p>'
  const infowindow = new google.maps.InfoWindow({
    content: contentString
  })
  infowindow.open(map, marker)
}
