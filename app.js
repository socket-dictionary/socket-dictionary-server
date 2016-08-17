var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var routes = require('./routes/index');
// var Game = require('./game.js');
// var game = new Game();

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

// change players to array?
var allGames = {
	123: {
		players: {
			'/#6reys8IXaGD-L5OPAAAA': {
				username: 'qwe',
				score: 0,
				currentRole: 'player'
			},
			'/#6reys8IXaGD-L5OPAAAA': {
				username: 'sup',
				score: 0,
				currentRole: 'player'
			}
		}
	}
};

io.on("connection", socket => {

	socket.on('new-game', function(data) {
		allGames[data.gameId] = {
			players: {
				[socket.id]: {
					username: data.username,
					score: 0,
					currentRole: 'picker'
				}
			}
		}
		socket.join(data.gameId)
		var userSpecificData = {
			username: data.username,
			role: 'picker',
			gameId: data.gameId,
			gameInfo: allGames[data.gameId]
		}
		io.to(socket.id).emit('set-user-info', userSpecificData)
	})

	socket.on('join-game', function(data) {
		var gameId = parseInt(data.gameId)
		allGames[gameId].players[socket.id] = {
			username: data.username,
			score: 0,
			currentRole: 'player'
		}
		socket.join(data.gameId)
		var userSpecificData = {
			username: data.username,
			role: 'player',
			gameId: gameId
		}
		io.to(socket.id).emit('set-user-info', userSpecificData)
		io.to(data.gameId).emit('player-joined', allGames[gameId])
		console.log("io.sockets.adapter.rooms=", io.sockets.adapter.rooms);
	})

});


app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());

app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = {
	app,
	server
};
