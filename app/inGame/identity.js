'use strict';

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/identity', {
    templateUrl: 'inGame/identity.html',
    controller: 'identityCtrl'
  });
}])

.controller('identityCtrl', ['$scope', 'gameState', '$location', '$timeout', 
	function($scope, gameState, $location, $timeout) {
    $scope.$parent.inGame = true;

	$scope.concealed = true;

    $scope.reveal = function() {
    	var isSpy = false;
    	$scope.concealed = false;
    	$scope.result = isSpy ? 'SPY' : 'RESISTANCE MEMBER';
    	$timeout($scope.leave, 5000);
    }

    $scope.leave = function() {
    	$location.path('/main');
    }
}]);