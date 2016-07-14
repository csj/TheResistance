'use strict';

app.factory('apiService', ['$http', function($http) {
  return {
    getIdentity: (name) => $http.get('/api/' + name + '/identity'),
    getMissions: () => $http.get('/api/missions'),
    getCurrentMissionWithPlayers: () => $http.get('/api/missions/currentWithPlayers'),
    getStatus: (name) => $http.get('/api/' + name + '/status'),
    getVoting: (name) => $http.get('/api/' + name + '/voting'),
    getExecute: (name) => $http.get('/api/' + name + '/execute'),

    doNominate: (name, team) => $http.post('/api/' + name + '/nominate', team),
    doExecute: (name, isSucceed) => $http.post('/api/' + name + '/execute/' + (isSucceed ? 'SUCCEED' : 'FAIL')),
    doVote: (name, isYes) => $http.post('/api/' + name + '/vote/' + (isYes ? "YES" : "NO"))
  };
}]);