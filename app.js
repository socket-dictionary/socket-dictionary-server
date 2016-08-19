var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var routes = require('./routes/index');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(cors());
var allGames = {}

io.on('connection', function(socket) {

    socket.on('join:room', function(data) {
        var room_name = data.room_name;
        if (io.sockets.adapter.rooms[room_name] == undefined || io.sockets.adapter.rooms[room_name].length < 4) {
            // console.log(io.sockets.adapter.rooms[room_name].length || "undefined");
            socket.join(room_name);
        } else {
            socket.emit('room_full', "The current room is full, please join another")
        }

        if (io.sockets.adapter.rooms[room_name].length === 1) {
            io.in(socket.id).emit('first_player', "first_player");
        }
        if (io.sockets.adapter.rooms[room_name].length === 4) {
            io.in(room_name).emit('start_game', "starting game....");
        }
    });
    socket.on('select_word', function(data, room_name) {
        io.in(room_name).emit('selected_word', data)
    });

    socket.on('leave:room', function(msg) {
        msg.text = msg.user + ' has left the room';
        socket.leave(msg.room);
        socket.in(msg.room).emit('message', msg);
    });

    socket.on('send:message', function(msg) {
        socket.in(msg.room).emit('message', msg);
    });

    socket.on('send:definition', function(def) {
        io.in(def.room).emit('definition', def);
    });

    gamesCounter = {}
    socket.on('sendChoice', function(choice, room) {
        if (gamesCounter[room]) {
            gamesCounter[room]++;
            if (gamesCounter[room] == 3) {
				gamesCounter[room] = 0;
                io.in(room).emit('roundFinished', "it works")
            }
        } else {
            gamesCounter[room] = 1;
        }


        if (choice == 'picker') {
            io.in(room).emit('picker', "update....")
        } else {
            io.in(room).emit(choice, "update....")
        }
    })
});


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
