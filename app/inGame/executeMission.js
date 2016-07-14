'use strict';

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/execute', {
    templateUrl: 'inGame/executeMission.html',
    controller: 'executeCtrl'
  });
}])

.controller('executeCtrl', ['$scope', 'apiService', '$location', '$timeout', 
    function($scope, apiService, $location, $timeout) {
    $scope.gameData.inGame = true;

    $scope.concealed = true;

    apiService.getExecute($scope.gameData.playerName).then(function (payload) {
        var result = payload.data;
        if (result.href) $location.path(result.href);
        $scope.needsVote = result.waitingForVote;
        $scope.missionName = result.missionName;
        $scope.isSpy = result.isSpy;
    });

    $scope.isBlocked = false;
    $scope.message = "Ensure that nobody can see your device.";

    $scope.reveal = function() {
        $scope.concealed = false;
        $scope.message = $scope.isSpy ?
            "The position of the buttons on-screen is randomized." :
            "You can see two Succeed buttons because you are a Resistance member.";
    }

    $scope.execute = function(isSucceed) {
        if ($scope.isBlocked) return;
        $scope.isBlocked = true;
        apiService.doExecute($scope.gameData.playerName, isSucceed).then(() => {
            $scope.message = $scope.isSpy
            ? (
                isSucceed ?
                    "Sneaky. Very sneaky." :
                    "You ... bastard. What have you done?"
            ) : "Your country thanks you for your service.";

            $timeout(function() { $location.path('/main') } , 3000);
        });
    }
}]);