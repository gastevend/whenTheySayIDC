'use strict'

const setAPIOrigin = require('../../lib/set-api-origin')
const config = require('./config')

$(() => {
  setAPIOrigin(location, config)
  initMap()
})

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled

let map

function initMap () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, onError)
  } else {
    $('body').prepend('<h4>Geloaction is not supported</h4>')
    console.log('location aint working bub.')
  }
}

function showPosition (position) {
  console.log('do I get into show Position')
  const lat = position.coords.latitude
  const long = position.coords.longitude
  const geoLocal = new google.maps.LatLng(lat, long)
  map = new google.maps.Map(document.getElementById('map'), {
    center: geoLocal,
    zoom: 12
  })
  const request = {
    location: geoLocal,
    radius: 7000,
    openNow: true,
    type: ['restaurant']
  }
  const service = new google.maps.places.PlacesService(map)
  service.nearbySearch(request, findRando)
}

function onError (error) {
  if (error.code === 2) {
    $('body').prepend('<h4>Allow your browser to access your location dummy</h4>')
  }
}

function findRando (results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    const rando = Math.floor(Math.random() * results.length)
    console.log(results[rando])
    createMarker(results[rando])
  } else {
    console.log(results, status)
  }
}

function createMarker (place) {
  const placeLoc = place.geometry.location
  const marker = new google.maps.Marker({
    position: placeLoc,
    map: map
  })
  let imgHtml = ' '
  if (place.photos) {
    imgHtml = '<img src=' + place.photos[0].getUrl({'maxWidth': 300, 'maxHeight': 500}) + '></img>'
    // '<img src= +' + place.photos[0].html_attributions + '></img>'
  }
  const contentString = '<h2>' + place.name + '<br>' + imgHtml + '</h2><p class="green">Open now</p>'
  const infowindow = new google.maps.InfoWindow({
    content: contentString
  })
  infowindow.open(map, marker)
}
