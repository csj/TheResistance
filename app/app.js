'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('the-resistance', ['ngRoute', 'ui.bootstrap', 'ui.bootstrap.tpls'])
	.config(['$routeProvider', function($routeProvider) {
  		$routeProvider.otherwise({redirectTo: '/games'});
	}]
)

.controller('indexCtrl', ['$scope', function($scope) {
	$scope.inGame = false;
}]);
