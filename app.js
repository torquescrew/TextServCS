
var express = require("express")
  , routes = require("./routes")
  , user = require("./routes/user")
  , http = require("http")
  , path = require("path")
  , fs = require("fs")
  , u = require("./util")
//  , io = require('socket.io').listen(80)
  , terminal = require('term.js')
  , fileIO = require('./fileIO')
  , termServer = require('./setupTermServer');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server, { log: false });


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
  res.sendfile(__dirname + '/public/aceEditor.html');
});

app.get("/_open_file", fileIO.openFile);

app.get("/_open_folder", fileIO.openFolder);

app.post("/_save_file", fileIO.saveFile);




server.listen(app.get("port"), function () {
  console.log("Express server listening on port " + app.get("port"));
});


termServer.setup(server);

io.sockets.on('connection', function (socket) {

  termServer.onConnection(socket);


  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

//console.log("hi");

