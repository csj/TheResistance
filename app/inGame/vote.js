'use strict';

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/vote', {
    templateUrl: 'inGame/vote.html',
    controller: 'voteCtrl'
  });
}])

.controller('voteCtrl', ['$scope', 'apiService', '$location', function($scope, apiService, $location) {
    $scope.gameData.inGame = true;
    
    apiService.getVoting($scope.gameData.playerName).then(function (payload) {
        var voting = payload.data;

        $scope.proposedMembers = voting.teamMembers;
        $scope.proposedBy = voting.proposedBy;
        $scope.missionName = voting.missionName;
        $scope.needsVote = voting.waitingForYourVote;
    });

    $scope.vote = function(hasAccepted) {
        apiService.doVote($scope.gameData.playerName, hasAccepted).then(() => {
    	   $location.path("/main");
        });
    }

    $scope.leave = () => $location.path("/main");
}]);