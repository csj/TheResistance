'use strict';

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/newGame', {
    templateUrl: 'newGame/newGame.html',
    controller: 'newGameCtrl'
  });
}])

.controller('newGameCtrl', ['$scope', '$location', function($scope, $location) {
	$scope.createGame = function() {
		var gameName = $scope.gameName;
		var password = $scope.password;

		$location.path('/lobby');
	}
}]);