// 'use strict';

// app.module('core').factory('googleMap', ['uiGmapGoogleMapApi', function(uiGmapGoogleMapApi) {
//   var sevice = {};

//   service.getMap = function(cb){
//     if (service.map) cb();
//     else {
//       uiGmapGoogleMapApi.then(function(maps) {
//         // Creates Google Maps object for sync purposes: 
//         var google = {};
//         google['maps'] = maps;
//         var markers = [];

//         service.map = maps;

//         // Define our map: 
//         var map = new google.maps.Map(document.getElementById('map-canvas'), {
//           mapTypeId: google.maps.MapTypeId.ROADMAP
//         });

//         var defaultBounds = new google.maps.LatLngBounds(
//           new google.maps.LatLng(37.7062, -122.4689),
//           new google.maps.LatLng(37.8246, -122.3711)
//         );

//         map.fitBounds(defaultBounds);

//         cb();
//       });
//     }
//   }

//   return service;


// }])