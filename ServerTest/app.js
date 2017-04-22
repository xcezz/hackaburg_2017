var express = require('express');
const path = require('path');
var io = require('socket.io')
var fs = require('fs');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var handle = require(path.join(__dirname,'handle.js'));
app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile('index.htm', {root: __dirname });
});

app.get('/speed', function (req, res) {
    res.send({rampUpSp: 100, rampDownSp: 100, time: 3000});
});

server.listen(3000);

var sockets = {};

io.sockets.on('connection', function (socket) {
    console.log("connected");
    sockets[socket.id] = socket;
	// der Client ist verbunden
	socket.emit('chat', { zeit: new Date(), text: 'Du bist nun mit dem Server verbunden!' });
	// wenn ein Benutzer einen Text senden
	socket.on('chat', function (data) {
		// so wird dieser Text an alle anderen Benutzer gesendet
		io.sockets.emit('chat', { zeit: new Date(), name: data.name || 'Anonym', text: data.text });
	});
    socket.on('data', function (data) {
        console.log(data);
		io.sockets.emit('data', data);
	});
});
console.log("\nWaiting for device to connect...");
