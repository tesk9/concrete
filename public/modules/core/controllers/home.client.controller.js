'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
    var events = {
      places_changed: function (searchBox) {};
    }
    $scope.searchbox = { template:'searchbox.tpl.html', events:   events};
  }
]);