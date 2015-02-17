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
  .controller('HomeController', ['$scope', 'uiGmapGoogleMapApi', 'Authentication', '$http', 'ZipsOfCity', 'medianIncome',
    function($scope, uiGmapGoogleMapApi, Authentication, $http, ZipsOfCity, medianIncome) {
  //    // This provides Authentication context.
      $scope.authentication = Authentication;

      uiGmapGoogleMapApi.then(function(maps) {
      // Creates Google Maps object for sync purposes: 
        var google = {};
        google['maps'] = maps;
        var markers = [];

        // Define our map: 
        var map = new google.maps.Map(document.getElementById('map-canvas'), {
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        var defaultBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(37.7062, -122.4689),
          new google.maps.LatLng(37.8246, -122.3711)
        );

        map.fitBounds(defaultBounds);

        var propertySearch = document.getElementById('search-button');
        google.maps.event.addDomListener(propertySearch, 'click', function() {
        // If city and state are an input, find all the zipcodes for that city. 
          if($scope.inputCity && $scope.inputState) {
            ZipsOfCity.find($scope.inputCity, $scope.inputState, function(obj) {
              var zipcodes = obj.zip_codes;
            // If there are valid zipcodes = valid city and state, then filter that zipdcode based on the given income.
              if(zipcodes && $scope.incomeMin && $scope.incomeMax) {
                medianIncome.filterByZipcodes(zipcodes, [$scope.incomeMin, $scope.incomeMax], function(data) {
                  // Data is the zipcodes in the city that fits the income criteria. 
                  // Look at our list of commercial properties and get all of the ones that are
                  // in one of these zipcodes:
                  console.log(data);
                });
              }
            });
          }
        });

        // Create the business type search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        var searchBox = new google.maps.places.SearchBox((input));
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


        // Make the bounds bias towards our search result: 
        google.maps.event.addListener(map, 'bounds_changed', function() {
          var bounds = map.getBounds();
          searchBox.setBounds(bounds);
        });
      }); 
    }
  ]);
