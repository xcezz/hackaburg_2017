var express = require('express');
const path = require('path');
var io = require('socket.io')
var fs = require('fs');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var Leap = require("leapjs");
app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile('index.htm', {root: __dirname });
});

app.get('/speed', function (req, res) {
    res.send({rampUpSp: 100, rampDownSp: 100, time: 3000});
});

server.listen(3000);

var controller = new Leap.Controller();

var frameCount = 0;
controller.on("frame", function(frame) {
  frameCount++;
    if(frameCount == 1){
        for(var socket_id in sockets){
            sockets[socket_id].emit('data', frame.hands);
        }
    }
});

var sockets = {};

io.sockets.on('connection', function (socket) {
    sockets[socket.id] = socket;
	// der Client ist verbunden
	socket.emit('chat', { zeit: new Date(), text: 'Du bist nun mit dem Server verbunden!' });
	// wenn ein Benutzer einen Text senden
	socket.on('chat', function (data) {
		// so wird dieser Text an alle anderen Benutzer gesendet
		io.sockets.emit('chat', { zeit: new Date(), name: data.name || 'Anonym', text: data.text });
	});
});

setInterval(function() {
  var time = frameCount/2;
  console.log("received " + frameCount + " frames @ " + time + "fps");
  frameCount = 0;
}, 2000);

controller.on('ready', function() {
    console.log("ready");
});
controller.on('connect', function() {
    console.log("connect");
});
controller.on('disconnect', function() {
    console.log("disconnect");
});
controller.on('focus', function() {
    console.log("focus");
});
controller.on('blur', function() {
    console.log("blur");
});
controller.on('deviceConnected', function() {
    console.log("deviceConnected");
});
controller.on('deviceDisconnected', function() {
    console.log("deviceDisconnected");
});

controller.connect();
console.log("\nWaiting for device to connect...");
