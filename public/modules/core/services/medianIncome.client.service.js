'use strict';

// Zip code service for filtering results
angular.module('core').service('medianIncome', [ '$http',
  function($http) {
    return {
      // zipcodes paramter of filteredZipCodes is an array of zipcode(s).
      filterByZipcodes: function(zipcodes, rangeInc, cb) {
          $http({
            method: 'GET',
            url: '/medianIncome',
            params: {zipcodes: zipcodes, rangeInc: rangeInc}
          }).success(function(medIncArr) {
            // medInc is an object with two properties (zipcode and medianIncome)
            cb(medInc);
          }).error(function() {
            return;
          });
      }
    };
  }

])