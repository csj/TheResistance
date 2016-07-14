'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('the-resistance', ['ngRoute', 'ui.bootstrap', 'ui.bootstrap.tpls'])
	.config(['$routeProvider', function($routeProvider) {
  		$routeProvider.otherwise({redirectTo: '/games'});
	}]
)

.controller('indexCtrl', ['$scope', '$location', function($scope, $location) {
    $scope.socket = io();
    $scope.socket.on('alert', msg => {
    	alert(msg);
    	if ($location.path() != "/main") {
    		$location.path("/main");
    	}
    });

	$scope.gameData = {
		inGame: false,
		playerName: "csj"	
	}; 
}]);
