"use strict";

var express = require("express")
  , http = require("http")
  , path = require("path")
  , fs = require("fs")
  , u = require("./public/scripts/utility")
  , terminal = require('term.js')
  , fio = require('./fileIO')
  , termServer = require('./setupTermServer')
  , si = require('./serverInterface');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server, { log: false });
termServer.setup(server);


app.set("port", process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger("dev"));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express["static"](path.join(__dirname, "public")));
app.use(terminal.middleware());

if ("development" === app.get("env")) {
  app.use(express.errorHandler());
}

app.get("/", function (req, res) {
  res.sendfile(__dirname + '/public/ide.html');
});

app.get("/_open_file", fio.openFile);

app.get("/_open_folder", fio.openFolder);

app.post("/_save_file", fio.saveFile);


server.listen(app.get("port"), function () {
  console.log("Express server listening on port " + app.get("port"));
});


io.sockets.on('connection', function (socket) {

  socket.on('setup term', function (data) {
    termServer.onConnection(socket);
  });

  fio.setSocket(socket, io.sockets);

  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });

  socket.on('task', function (task) {
    if (typeof si[task.name] !== 'undefined') {
      var result = si[task.name].apply(this, task.args);

      socket.emit(task.id, result);
    }
    else {
      console.log("si[task.name](" + task.name + ") doesn't exist!");
    }
  });

});


