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
  .controller('HomeController', ['$scope', 'uiGmapGoogleMapApi', 'Authentication', '$http', 'ZipsOfCity', 'medianIncome', '$timeout',
    function($scope, uiGmapGoogleMapApi, Authentication, $http, ZipsOfCity, medianIncome, $timeout) {
  //    // This provides Authentication context.
      $scope.authentication = Authentication;

      $scope.favorites;
      $http.get('/favorites').success(function(favorites) {
        $scope.favorites = favorites;
      });

      $scope.checkFavorites = function(property) {
        return $scope.favorites.some(function(favorite) {    
          return property.name == favorite.address;
        });
      };

      $scope.addFavorite = function(property) {
        var exists = $scope.checkFavorites(property);

        if (!exists) {
          $http.post('/favorites', {
            address: property.name,
            buildingType: property.type,
            img: property.img,
            size: property.size,
            numOfUnits: property.numOfUnits,
            description: property.description
          }).success(function(data) { 
            $scope.favorites.push(data); 
          });
        }    
      };

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

        $scope.markers = [];

        var callAlert = function() {
          $scope.searchErr = false;
        };

        var propertySearch = document.getElementById('search-button');
        google.maps.event.addDomListener(propertySearch, 'click', function() {

        // If city and state are an input, find all the zipcodes for that city. 
          if($scope.inputCity && $scope.inputState) {
            ZipsOfCity.find($scope.inputCity, $scope.inputState, function(obj) {
              var zipcodes = obj.zip_codes;
            // If there are valid zipcodes = valid city and state, then filter that zipdcode based on the given income.
              if(zipcodes && $scope.incomeMin && $scope.incomeMax) {
                medianIncome.filterByZipcodes(zipcodes, [$scope.incomeMin, $scope.incomeMax], function(properties) {
                  //checks if there are any markers already existing, this will delete if true
                  if(properties.length < 1) {
                    $scope.searchErr = true;
                    $timeout(callAlert, 2500);
                    return;
                  } 

                  if($scope.markers) {
                    $scope.markers.forEach(function(marker) {
                      marker.setMap(null);
                    });
                  } 

                  var addr = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
                  $scope.alphabetArr = [];
                  properties.forEach(function(v,i) {
                    var address = v.name + ' ' + v.cityState;
                    var alphabet = String.fromCharCode('A'.charCodeAt(0) + i);
                    //for each property we do a get request and create a marker
                    $http.get(addr+address).success(function(data, status, headers) {
                      var coords = data.results[0].geometry.location;
                      var marker = new google.maps.Marker({
                        map: map,
                        position: new google.maps.LatLng(coords.lat, coords.lng),
                        icon: 'http://maps.google.com/mapfiles/marker' + alphabet + '.png',
                        animation: google.maps.Animation.DROP
                      });

                      $scope.alphabetArr.push(marker.icon);
                      $scope.markers.push(marker);
                    });
                  });
                  $scope.filteredProperties = properties;
                  $scope.showProperties = true;

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
          var infowindow = new google.maps.InfoWindow();

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
