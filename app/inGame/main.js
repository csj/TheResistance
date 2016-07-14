'use strict';

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'inGame/main.html',
    controller: 'mainCtrl'
  });
}])

.controller('mainCtrl', ['$scope', 'apiService', '$location', '$timeout', 
	function($scope, apiService, $location, $timeout) {

    $scope.gameData.inGame = true;
    $scope.socket.on('alert', msg => {
        $scope.update();
    });

    $scope.continuousTimer = function() {
        $scope.update();
        if ($location.path() == "/main") $timeout($scope.continuousTimer, 5000);
    }

    $scope.update = function() {
        apiService.getStatus($scope.gameData.playerName).then(function(payload) {
            var status = payload.data;
            if (status.href) {
                $location.path(status.href);
            }
            $scope.status = status.message;
        });
    }

    $scope.continuousTimer();
}]);