//var app, buff, express, fs, http, io, openFile, openFolder, path, pty, routes, saveFile, server, socket, stream, term, terminal, u, user, wd;

var express = require("express")
  , routes = require("./routes")
  , user = require("./routes/user")
  , http = require("http")
  , path = require("path")
  , wd = require("./walkDirectory")
  , fs = require("fs")
  , u = require("./util")
  , pty = require('pty.js')
  , io = require('socket.io')
  , terminal = require('term.js');

var stream;
if (process.argv[2] === '--dump') {
  stream = fs.createWriteStream(__dirname + '/dump.log');
}

/*
 Open Terminal
 */
var buff = [];
var socket = null;
var term = null;

term = pty.fork(process.env.SHELL || "sh", [], {
  name: (fs.existsSync("/usr/share/terminfo/x/xterm-256color") ? "xterm-256color" : "xterm"),
  cols: 80,
  rows: 24,
  cwd: process.env.HOME
});

term.on("data", function (data) {
  if (stream) {
    stream.write("OUT: " + data + "\n-\n");
  }
  if (!socket) {
    buff.push(data);
  } else {
    socket.emit("data", data);
  }
});


console.log("" + "Created shell with pty master/slave" + " pair (master: %d, pid: %d)", term.fd, term.pid);

var app = express();
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

app.get("/_open_file", function (req, res) {
  openFile(req.query.filename, res);
});


app.get("/_open_folder", function (req, res) {
  var folder;
  folder = req.query.folderName;
  if (u.badString(folder)) {
    if (fs.existsSync('/Users/tobysuggate/Doc1uments/Repos/CppDependencies/workspace/Dependancies')) {
      folder = '/Users/tobysuggate/Documents/Repos/CppDependencies/workspace/Dependancies';
    } else {
      folder = process.env.HOME + "/Desktop";
    }
  }
  openFolder(folder, res);
});

app.post("/_save_file", function (req, res) {
  var content, file;
  file = req.body.filename;
  content = req.body.content;
  if (u.okString(file) && u.okString(content)) {
    saveFile(file, content);
  } else {
    console.log("/_save_file received invalid strings");
  }
  res.send("wrote file: " + file);
});

var server = http.createServer(app);

server.listen(app.get("port"), function () {
  console.log("Express server listening on port " + app.get("port"));
});

server.on('connection', function(socket) {
  var address = socket.remoteAddress;
  if (address !== '127.0.0.1' && address !== '::1') {
    try {
      socket.destroy();
    } catch (e) {
      console.log("socket.destroy() failed");
    }
    console.log('Attempted connection from %s. Refused.', address);
  }
});


/*
 Sockets
 */
io = io.listen(server, {
  log: false
});

io.sockets.on('connection', function(sock) {
  socket = sock;

  socket.on('data', function(data) {
    if (stream) stream.write('IN: ' + data + '\n-\n');
    term.write(data);
  });

  socket.on('disconnect', function() {
    socket = null;
  });

  while (buff.length) {
    socket.emit('data', buff.shift());
  }
});


function saveFile(file, content) {
  fs.writeFileSync(file, content);
  console.log("wrote file: " + file);
}


function openFile(file, response) {
  fs.readFile(file, function (err, data) {
    if (err) {
      throw err;
    }
    response.json({
      filename: file,
      content: data.toString()
    });
  });
}


function openFolder(folder, response) {
  if (u.okString(folder)) {
    wd.getDirectoryList(folder, response);
  }
}
