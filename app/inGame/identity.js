'use strict';

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/identity', {
    templateUrl: 'inGame/identity.html',
    controller: 'identityCtrl'
  });
}])

.controller('identityCtrl', ['$scope', 'apiService', '$location', '$timeout', 
	function($scope, apiService, $location, $timeout) {

    $scope.loading = true;

    apiService.getIdentity($scope.gameData.playerName).then(function (payload) {
        var state = payload.data;
        $scope.loading = false;

        $scope.reveal = function() {
            $scope.isSpy = state.isSpy;
            $scope.otherSpies = state.otherSpies;

            $scope.concealed = false;
            $scope.result = $scope.isSpy ? 'SPY' : 'RESISTANCE MEMBER';
            $timeout($scope.leave, 5000);
        }

        $scope.leave = function() {
            $location.path('/main');
        }
    });
    $scope.$parent.inGame = true;
	$scope.concealed = true;

}]);