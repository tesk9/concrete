'use strict';

angular.module('users').controller('FavoritesController', ['$scope', '$http', '$state',
  function($scope, $http, $state) {
    
    $http({
      method: 'GET',
      url: '/favorites'
    }).success(function(data) {
      $scope.favorites = data;
    });

    $scope.deleteFavorite = function(id) {
      $http.delete('/favorites/'+id);
      $state.reload();
    }
  }
]);