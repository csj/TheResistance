'use strict';

app.factory('gameState', [function() {

  var retVal = {
    players: ['csj', 'jazz', 'phil', 'jordan', 'lyla'],
    playerName: "",
    //href: "/vote",
    currentDescription: "Waiting for phil to nominate a mission team for Mission 1",
    currentMissionIndex: 1,
    playerIsSpy: true,

    missions: [
    	{name: "Mission 1", teamsize: 2, succeeded: true, teams:
          [{chosenBy: "csj", members: ["csj", "jazz"], yesVotes:["jazz", "csj", "phil", "jordan"]}]
        },
        {name: "Mission 2", teamsize: 3, failed: true, teams:
          [{chosenBy: "jordan", members: ["phil", "jordan", "lyla"], yesVotes:["phil", "jordan", "lyla"]},
           {chosenBy: "phil", members: ["phil", "jordan", "lyla"], yesVotes:[]},
           {chosenBy: "jazz", members: ["jazz", "lyla", "csj"], yesVotes:["jordan"]}]
        },
    	{name: "Mission 3", teamsize: 3, teams: []},
    	{name: "Mission 4", teamsize: 4, requiresDoubleFires: true, teams: []},
    	{name: "Mission 5", teamsize: 4, teams: []},
    ],
  };

  return retVal;
}]);