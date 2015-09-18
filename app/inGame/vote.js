'use strict';

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/vote', {
    templateUrl: 'inGame/vote.html',
    controller: 'voteCtrl'
  });
}])

.controller('voteCtrl', ['$scope', 'gameState', '$location', function($scope, gameState, $location) {
    $scope.$parent.inGame = true;
    var mission = gameState.missions[gameState.currentMissionIndex];

    $scope.proposedMembers = mission.members;
    $scope.proposedBy = mission.chosenBy;
    $scope.missionName = mission.name;

    $scope.vote = function(hasAccepted) {
    	$location.path("/main");
    }
}]);