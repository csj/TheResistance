// server.js

// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================

//mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/app'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(methodOverride());
app.use(function(req, res, next) { setTimeout(next, 1000); });

var http = require('http').Server(app);
var io = require('socket.io')(http);
io.on('connection', function(socket){
  console.log('a user connected');
});

var game = {
    players: ['csj', 'jazz', 'phil', 'jordan', 'lyla'],
    spies: ['csj', 'phil'],

    missions: [
        {name: "Mission 1", teamsize: 2, teams: [
            //{accepted: true, chosenBy: "csj", members: ["csj", "jazz"], yesVotes:["jazz", "csj", "phil", "jordan"]}
            ]
        },
        {name: "Mission 2", teamsize: 3, teams:
          [
            //{accepted: true, chosenBy: "jordan", members: ["phil", "jordan", "lyla"], yesVotes:["phil", "jordan", "lyla"]},
            //{chosenBy: "phil", members: ["phil", "jordan", "lyla"], yesVotes:[]},
            //{chosenBy: "jazz", members: ["jazz", "lyla", "csj"], yesVotes:["jordan"]}
          ]
        },
        {name: "Mission 3", teamsize: 3, teams: []},
        {name: "Mission 4", teamsize: 4, requiresDoubleFires: true, teams: []},
        {name: "Mission 5", teamsize: 4, teams: []},
    ],

    currentState: {
        type: "selectingTeam",
        playerIndex: 0,
        missionIndex: 0
    }

    // currentState: { 
    //     type: "executingMission",
    //     team: ["csj", "jazz"],
    //     missionIndex: 3,
    //     playerIndex: 4,
    //     participated: ["jazz"],
    //     failVotes: 0
    // }

    // currentState: {
    //     type: "votingForTeam",
    //     playerIndex: 3,
    //     team: ['csj', 'jazz', 'jordan'],
    //     missionIndex: 2,
    //     yesVotes: 2,
    //     noVotes: 2,
    //     voters: ["csj", "lyla", "jazz", "phil"]
    // }

};

app.get('/api/:name/identity', function (req, res) {
    var name = req.params["name"];
    var retVal = { isSpy: false };
    if (game.spies.indexOf(name) != -1) {
        retVal.isSpy = true;
        retVal.otherSpies = [];

        for (var i = 0; i < game.spies.length; i++) {
            var spy = game.spies[i];
            if (spy == name) continue;
            retVal.otherSpies.push(spy);
        };
    }

    res.send(retVal);
})

app.get('/api/missions', function (req, res) {
    // deep copy
    var retVal = JSON.parse(JSON.stringify(game.missions));
    for (var a in retVal) {
        var mission = retVal[a];
        for (var b in mission.teams) {
            var team = mission.teams[b];
            team.notParticipating = [];
            for (var c in game.players) {
                if (team.members.indexOf(game.players[c]) == -1) {
                    team.notParticipating.push(game.players[c]);
                }
            }
            for (var d in team.members) {
                var name = team.members[d];
                team.members[d] = {
                    name: name,
                    vote: team.yesVotes.indexOf(name) != -1
                };
            }
            for (var e in team.notParticipating) {
                var name = team.notParticipating[e];
                team.notParticipating[e] = {
                    name: name,
                    vote: team.yesVotes.indexOf(name) != -1
                };
            }
        }
    }

    res.send(retVal);
});

app.get('/api/missions/currentWithPlayers', function (req, res) {
    var retVal = game.missions[game.currentState.missionIndex];
    retVal.players = game.players;
    res.send(retVal);
});

app.get('/api/:name/execute', function (req, res) {
    var name = req.params["name"];
    var state = game.currentState;

    function doIt() {
        if (state.type != 'executingMission') return { 'href': '/main' };
        if (state.team.indexOf(name) == -1) return { 'href': '/main' };
        return {
            'waitingForVote' : state.participated.indexOf(name) == -1,
            'missionName' : game.missions[state.missionIndex].name,
            'isSpy' : game.spies.indexOf(name) != -1
        };
    }

    res.send(doIt());
});

app.get('/api/:name/voting', function (req, res) {
    var name = req.params["name"];
    var state = game.currentState;
    
    var retVal = {
        proposedBy: game.players[state.playerIndex],
        teamMembers: state.team,
        missionName: game.missions[state.missionIndex].name,
        waitingForYourVote: state.voters.indexOf(name) == -1
    };

    res.send(retVal);
});


app.get('/api/:name/status', function (req, res) {
    var name = req.params["name"];

    function getStatus() {
        var state = game.currentState;
        var type = state.type;
        var player = game.players[game.currentState.playerIndex];

        if (type == 'selectingTeam') {
            if (player == name)
                return { href: "/nominate" };
            return { message: "Waiting for " + player + " to select a team for " + game.missions[game.currentState.missionIndex].name};
        }
        if (type == 'votingForTeam') {
            if (state.voters.indexOf(name) != -1) {
                return { message: 
                    "Waiting for remaining votes ..."
                };
            }
            return { href: "/vote" }
        }
        if (type == 'executingMission') {
            if (state.team.indexOf(name) != -1 && state.participated.indexOf(name) == -1)
                return { href: '/execute' }
            return { message: 'Waiting for people to execute mission ...'}
        }
        return { message: "I don't know??" };
    }

    res.send(getStatus());
});

app.post('/api/:name/nominate', function (req,res) {
    var name = req.params["name"];
    if (game.currentState.type != 'selectingTeam') throw "can't: wrong state";
    if (game.players[game.currentState.playerIndex] != name) throw "can't: wrong player";

    var team = req.body;
    if (team.length != game.missions[game.currentState.missionIndex].teamsize) {
        throw "can't: wrong size of team";
    }

    game.missions[game.currentState.missionIndex].teams.splice(0,0,{
        chosenBy: game.players[game.currentState.playerIndex],
        members: team,
        yesVotes: []
    });

    game.currentState = {
        type: "votingForTeam",
        playerIndex: game.currentState.playerIndex,
        team: team,
        missionIndex: game.currentState.missionIndex,
        yesVotes: 0,
        noVotes: 0,
        voters: []
    }

    console.log(JSON.stringify(game.currentState));
    io.emit('alert', name + " has selected the team");
    res.send('');
});

app.post('/api/:name/vote/:vote', function (req, res) {
    var name = req.params['name'];
    var vote = req.params['vote']; // YES / NO

    var state = game.currentState;

    if (state.type != 'votingForTeam') throw "can't: wrong state";
    if (state.voters.indexOf(name) != -1) throw "can't: already voted";
    if (vote == 'YES') {
        state.yesVotes++;
        game.missions[state.missionIndex].teams[0].yesVotes.push(name);
    } else {
        state.noVotes++;
    }

    state.voters.push(name);
    if (state.voters.length == game.players.length) {
        var accepted = state.yesVotes >= state.noVotes;

        if (accepted) {
            io.emit('alert', "The team was ACCEPTED");
            game.missions[game.currentState.missionIndex].accepted = true;
            game.currentState = {
                type: "executingMission",
                team: game.currentState.team,
                missionIndex: game.currentState.missionIndex,
                playerIndex: game.currentState.playerIndex,
                participated: [],
                failVotes: 0
            };
        } else {
            io.emit('alert', "The team was REJECTED");
            game.currentState = {
                type: "selectingTeam",
                playerIndex: (game.currentState.playerIndex + 1) % game.players.length,
                missionIndex: game.currentState.missionIndex
            };
            // TODO: Check if 5 failed teams
        }
    }

    console.log(JSON.stringify(game.currentState));

    res.send('');
});

app.post('/api/:name/execute/:vote', function (req, res) {
    var name = req.params['name'];
    var vote = req.params['vote']; // SUCCEED / FAIL

    var state = game.currentState;

    if (state.type != 'executingMission') throw "can't: wrong state";
    if (state.team.indexOf(name) == -1) throw "can't: wrong player";
    if (state.participated.indexOf(name) != -1) throw "can't: already voted";
    if (vote == 'FAIL') state.failVotes++;
    state.participated.push(name);

    if (state.participated.length < state.team.length) {
        res.send('');
        return;
    }

    var requiredFailVotes = game.missions[state.missionIndex].requiresDoubleFires ? 2 : 1;

    if (state.failVotes >= requiredFailVotes) {
        game.missions[game.currentState.missionIndex].failed = true;
        io.emit('alert', "The mission FAILED");
    } else {
        game.missions[game.currentState.missionIndex].succeeded = true;
        io.emit('alert', "The mission SUCCEEDED");
    }

    // TODO: If gg

    game.currentState = {
        type: "selectingTeam",
        playerIndex: (game.currentState.playerIndex + 1) % game.players.length,
        missionIndex: game.currentState.missionIndex + 1
    };

    console.log(JSON.stringify(game.currentState));
    res.send('');
});

// listen (start app with node server.js) ======================================
http.listen(8080);
console.log("App listening on port 8080");