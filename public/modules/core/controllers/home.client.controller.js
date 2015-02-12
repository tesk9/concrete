'use strict';


angular.module('core')
  .config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
    GoogleMapApi.configure({
  //    key: 'your api key',
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
    }
  })
  .controller('HomeController', ['$scope', 'uiGmapGoogleMapApi', 'Authentication',
  	function($scope, uiGmapGoogleMapApi, Authentication) {
  // 		// This provides Authentication context.
  		$scope.authentication = Authentication;

      uiGmapGoogleMapApi.then(function(maps) {
        maps.visualRefresh = true;

      });

      angular.extend($scope, {
        selected: {
          options: {
            visible:false

          },
          templateurl:'window.tpl.html',
          templateparameter: {}
        },
        map: {
          control: {},
          center: {
            latitude: 40.74349,
            longitude: -73.990822
          },
          zoom: 12,
          dragging: false,
          bounds: {},
          markers: [],
          idkey: 'place_id',
          events: {
            idle: function (map) {
                       
            },
            dragend: function(map) {
              //update the search box bounds after dragging the map
              var bounds = map.getBounds();
              var ne = bounds.getNorthEast();
              var sw = bounds.getSouthWest(); 
              $scope.searchbox.options.bounds = new google.maps.LatLngBounds(sw, ne);
              //$scope.searchbox.options.visible = true;
            }
          }
        },
        searchbox: {
          template:'searchbox.tpl.html',
          //position:'top-right',
          position:'top-left',
          options: {
            bounds: {}
          },
          //parentdiv:'searchBoxParent',
          events: {
            places_changed: function (searchBox) {
              
              var places = searchBox.getPlaces()

              if (places.length == 0) {
                return;
              }
              // For each place, get the icon, place name, and location.
              var newMarkers = [];
              var bounds = new google.maps.LatLngBounds();
              for (var i = 0, place; place = places[i]; i++) {
                // Create a marker for each place.
                var marker = {
                  id:i,
                  place_id: place.place_id,
                  name: place.name,
                  latitude: place.geometry.location.lat(),
                  longitude: place.geometry.location.lng(),
                  options: {
                    visible:false
                  },
                  templateurl:'window.tpl.html',
                  templateparameter: place
                };
                newMarkers.push(marker);

                bounds.extend(place.geometry.location);
              }

              $scope.map.bounds = {
                northeast: {
                  latitude: bounds.getNorthEast().lat(),
                  longitude: bounds.getNorthEast().lng()
                },
                southwest: {
                  latitude: bounds.getSouthWest().lat(),
                  longitude: bounds.getSouthWest().lng()
                }
              }

              _.each(newMarkers, function(marker) {
                marker.closeClick = function() {
                  $scope.selected.options.visible = false;
                  marker.options.visble = false;
                  return $scope.$apply();
                };
                marker.onClicked = function() {
                  $scope.selected.options.visible = false;
                  $scope.selected = marker;
                  $scope.selected.options.visible = true;
                };
              });

              $scope.map.markers = newMarkers;
            }
          }
        }
      });
    }
  ]);