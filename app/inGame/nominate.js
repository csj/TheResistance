'use strict';

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/nominate', {
    templateUrl: 'inGame/nominate.html',
    controller: 'nominateCtrl'
  });
}])

.controller('nominateCtrl', ['$scope', 'gameState', '$location', '$timeout', 
	function($scope, gameState, $location, $timeout) {
    $scope.$parent.inGame = true;

    $scope.teamSize = 2;
    $scope.missionName = "Mission 3";
    $scope.players = _.map(gameState.players, function (p) { return {name: p, selected: false}});

    $scope.canNominate = function() {
        return _.filter($scope.players, function(p) { return p.selected }).length == $scope.teamSize;
    }

    $scope.nominate = function() {
        if (!$scope.canNominate()) return;
        $location.path("/main");
    }
}]);