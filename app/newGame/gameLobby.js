'use strict';

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/lobby', {
    templateUrl: 'newGame/gameLobby.html',
    controller: 'gameLobbyCtrl'
  });
}])

.controller('gameLobbyCtrl', [
	'$scope', 'gameState', '$location',
	function($scope, gameState, $location) {

    $scope.gameName = "csj's game";
    $scope.ourName = gameState.playerName;

	$scope.canStart = function() {
		return $scope.players.length >= 5 && $scope.players.length <= 10;
	}

    $scope.startGame = function() {
        $location.path('/main');
    }

	$scope.deleteGame = function() {
		$location.path('/games');
	}

    $scope.players = [
        { name: "csj" },
        { name: "phil" },
        { name: "jordan" },
        { name: "amanda" },
        { name: "ted" }
    ];
}]);