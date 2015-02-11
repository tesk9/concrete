'use strict';

//Setting up route
angular.module('property').config(['$stateProvider',
	function($stateProvider) {
		// Property state routing
		$stateProvider.
		state('property', {
			url: '/property',
			templateUrl: 'modules/property/views/property.client.view.html'
		});
	}
]);