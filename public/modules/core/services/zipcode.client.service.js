'use strict';

// Zip code service for filtering results
angular.module('core').service('Zips', [ '$http',

  function($http) {
    return {
      filteredZipCodes: function(zipcodes, rangeInc, cb) {
        zipcodes.forEach(function(zip) {
          $http({
            method: 'GET',
            url: '/zip/' + zip
          }).success(function(medInc) {
            if(Number(rangeInc[0]) <= Number(medInc) && Number(medInc) <= (rangeInc[1])) {
              if(cb) {
                cb(zip)
              }
            } else {
              return;
            }

          }).error(function() {
            return;
          });
        });
      }
    };
  }

]);