'use strict';

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/games', {
    templateUrl: 'gameList/gameList.html',
    controller: 'gameListCtrl'
  });
}])

.controller('gameListCtrl', ['$scope', 'gameState', '$location', function($scope, gameState, $location) {
    $scope.refresh = function() {
	    $scope.games = [
	        { name: "csj's game", players: 4 },
	        { name: "ted's game", players: 1 }
	    ];
	    //$scope.$apply();
    }

    $scope.refresh();

    $scope.playerName = gameState.playerName;

    $scope.createNewGame = function() {
    	$location.path('/newGame');
    }

    $scope.join = function(game) {
    	gameState.playerName = $scope.playerName;
    	$location.path('/main');
    }
}]);