'use strict';


angular.module('core')
  .config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
    GoogleMapApi.configure({
      v: '3.17',
      libraries: 'places'
    });
  }])
  .run(['$templateCache', function ($templateCache) {
    $templateCache.put('window.tpl.html', '<div ng-controller="WindowCtrl" ng-init="showPlaceDetails(parameter)">{{place.name}}</div>');
  }])
  .controller('WindowCtrl', function ($scope) {
    $scope.place = {};
    $scope.showPlaceDetails = function(param) {
      $scope.place = param;
    };
  })
  .controller('HomeController', ['$scope', 'uiGmapGoogleMapApi', 'Authentication', '$http', 'ZipsOfCity',
    function($scope, uiGmapGoogleMapApi, Authentication, $http, ZipsOfCity) {
  //    // This provides Authentication context.
      $scope.authentication = Authentication;
      
      uiGmapGoogleMapApi.then(function(maps) {
        // Creates Google Maps object for sync purposes: 
        var google = {};
        google['maps'] = maps;

        var markers = [];
        var map = new google.maps.Map(document.getElementById('map-canvas'), {
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        var infowindow = new google.maps.InfoWindow();  

        var defaultBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(37.7062, -122.4689),
          new google.maps.LatLng(37.8246, -122.3711)
        );

        map.fitBounds(defaultBounds);

        $http.get('/scraper').success(function(data) {
          var geocoder = new google.maps.Geocoder();

          data.forEach(function(location) {
            if (location.cityState) {
              var address = (location.name + ', ').concat(location.cityState);
            } else {
              var address = location.name;
            }

            geocoder.geocode( {address: address}, function(results, status) {
              if (status === google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                  map: map,
                  position: results[0].geometry.location
                });
              } else {
                alert('Geocode was not successful for the following reason: ' + status);
              }
            });
          });
          
        });

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        var searchBox = new google.maps.places.SearchBox((input));
          // [START region_getplaces]
          // Listen for the event fired when the user selects an item from the
          // pick list. Retrieve the matching places for that item.
          google.maps.event.addListener(searchBox, 'places_changed', function() {
            var places = searchBox.getPlaces();

            if(places.length == 0) {
              return;
            }
            for(var i = 0, marker; marker = markers[i]; i++) {
              marker.setMap(null);
            }

            // For each place, get the icon, place name, and location.
            markers = [];
            var bounds = new google.maps.LatLngBounds();

            for(var i = 0, place; place = places[i]; i++) {
              var image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
              };

              // Create a marker for each place.
              var marker = new google.maps.Marker({
                map: map,
                icon: image,
                title: place.name,
                position: place.geometry.location
              });

              markers.push(marker);

              bounds.extend(place.geometry.location);
            }

            map.fitBounds(bounds);
          });
          // [END region_getplaces]

          // Bias the SearchBox results towards places that are within the bounds of the
          // current map's viewport.
          google.maps.event.addListener(map, 'bounds_changed', function() {
            var bounds = map.getBounds();
            searchBox.setBounds(bounds);
          });
      });
    }
  ]);
