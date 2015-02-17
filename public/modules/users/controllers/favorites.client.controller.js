'use strict';

angular.module('users').controller('FavoritesController', ['$scope', '$http',
  function($scope, $http) {
    
    $http({
      method: 'GET',
      url: '/favorites'
    }).success(function(data) {
      $scope.favorites = data;
    });

  }
]);