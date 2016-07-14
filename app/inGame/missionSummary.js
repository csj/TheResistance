'use strict';

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/missions', {
    templateUrl: 'inGame/missionSummary.html',
    controller: 'missionSummaryCtrl'
  });
}])

.controller('missionSummaryCtrl', ['$scope', 'apiService', function($scope, apiService) {
    $scope.$parent.inGame = true;
    apiService.getMissions().then(function(payload) {
	    $scope.missions = payload.data;
    }, function(error) {
    	console.log(error);
    });
}]);