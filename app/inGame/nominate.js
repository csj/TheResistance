'use strict';

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/nominate', {
    templateUrl: 'inGame/nominate.html',
    controller: 'nominateCtrl'
  });
}])

.controller('nominateCtrl', ['$scope', 'apiService', '$location', '$timeout', 
	function($scope, apiService, $location, $timeout) {
    $scope.gameData.inGame = true;

    apiService.getCurrentMissionWithPlayers($scope.gameData.playerName).then(function (payload) {
        var mission = payload.data;
        $scope.teamSize = mission.teamsize;
        $scope.missionName = mission.name;
        $scope.players = _.map(mission.players, p => { return {name: p, selected: false }});
    });
    
    $scope.canNominate = function() {
        return _.filter($scope.players, p => p.selected).length == $scope.teamSize;
    }

    $scope.nominate = function() {
        if (!$scope.canNominate()) return;
        var names = _.chain($scope.players)
            .filter(p => p.selected)
            .map(p => p.name)
            .value();
        apiService.doNominate($scope.gameData.playerName, names).then(() => {
            $location.path("/main");    
        });
    }
}]);