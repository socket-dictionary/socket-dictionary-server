var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var routes = require('./routes/index');
var Game = require('./game.js');
var game = new Game();

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

var allGames = [];

io.on("connection", socket => {
	console.log('A user has entered')

	socket.on('new-game', function(data) {
    var newGame = new Game();
		console.log('room=', data.gameId);
    newGame.createGame(data)
    allGames.push(newGame)
		console.log('data', data)
		socket.join(data.gameId)
		io.emit('player-joined', data)
	})

	socket.on('join-game', function(data) {
    var gameToJoin = allGames.find(function (game) { return game.gameId == data.gameId})
    gameToJoin.players.push({username: data.username, score: 0, currentRole: 'player'})
    console.log('allGames=', allGames);
		// game.joinGame(data.playerUsername)
		socket.join(data.gameId)
		io.emit('player-joined', data, gameToJoin)
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
