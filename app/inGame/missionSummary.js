'use strict';

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/missions', {
    templateUrl: 'inGame/missionSummary.html',
    controller: 'missionSummaryCtrl'
  });
}])

.controller('missionSummaryCtrl', ['$scope', 'gameState', function($scope, gameState) {
    $scope.$parent.inGame = true;
    $scope.missions = gameState.missions;
}]);