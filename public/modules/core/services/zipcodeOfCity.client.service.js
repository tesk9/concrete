'use strict';

angular.module('core').service('ZipsOfCity', ['$http',
  function($http) {
    return {
      find: function(city, state, cb) {
        $http({
          method: 'GET',
          url: '/zipcodesof/' + state + '/' + city
        }).success(function(zipcodes){
          cb(zipcodes);
        });
      }
    }
}]);