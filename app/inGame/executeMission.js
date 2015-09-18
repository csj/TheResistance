'use strict';

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/execute', {
    templateUrl: 'inGame/executeMission.html',
    controller: 'executeCtrl'
  });
}])

.controller('executeCtrl', ['$scope', 'gameState', '$location', '$timeout', 
    function($scope, gameState, $location, $timeout) {
    $scope.$parent.inGame = true;

    $scope.concealed = true;

    var mission = gameState.missions[gameState.currentMissionIndex];
    $scope.missionName = mission.name;
    $scope.isBlocked = false;
    $scope.message = "Ensure that nobody can see your device.";

    $scope.reveal = function() {
        $scope.concealed = false;
        $scope.isSpy = true;
        $scope.message = $scope.isSpy ?
            "The position of the buttons on-screen is randomized." :
            "You can see two Succeed buttons because you are a Resistance member.";
    }

    $scope.execute = function(isSucceed) {
        if ($scope.isBlocked) return;
        $scope.message = $scope.isSpy
            ? (
                isSucceed ?
                    "Sneaky. Very sneaky." :
                    "You ... bastard. What have you done?"
            ) : "Your country thanks you for your service.";

        $scope.isBlocked = true;
        $timeout(function() { $location.path('/main') } , 3000);
    }
}]);