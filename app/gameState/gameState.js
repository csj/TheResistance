'use strict';

app.factory('gameState', ['$timeout', function($timeout) {

  var retVal = {
    players: ['csj', 'ted', 'phil', 'jordan', 'lyla'],
    playerName: "",
    href: "/vote",
    currentDescription: "Waiting for phil to nominate a mission team for Mission 1",
    missions: [
    	{name: "Mission 1", teamsize: 2, members: ["csj", "ted"], succeeded:true},
    	{name: "Mission 2", teamsize: 3, members: ["phil", "jordan", "lyla"], failed:true},
    	{name: "Mission 3", teamsize: 3, members: []},
    	{name: "Mission 4", teamsize: 3, members: []},
    	{name: "Mission 5", teamsize: 2, members: []},
    ],
    playerIsSpy: true,
  };

  return retVal;
}]);