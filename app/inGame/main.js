'use strict';

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'inGame/main.html',
    controller: 'mainCtrl'
  });
}])

.controller('mainCtrl', ['$scope', 'gameState', '$location', '$timeout', 
	function($scope, gameState, $location, $timeout) {

    $scope.$parent.inGame = true;

    $scope.update = function() {
        if (gameState.href) {
            $location.path(gameState.href);
        }
        $scope.status = gameState.currentDescription;
        $timeout($scope.update, 5000);
    }

    $scope.update();
}]);