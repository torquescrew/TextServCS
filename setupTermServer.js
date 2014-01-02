/**
 * Created by tobysuggate on 22/12/13.
 */

var express = require("express")
  , fs = require("fs")
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
//var sockets = null;
var term = null;
var server = null;

exports.setup = function (s) {
  "use strict";

  server = s;

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
    return !socket
      ? buff.push(data)
      : socket.emit('data', data);
  });

  console.log("" + "Created shell with pty master/slave" + " pair (master: %d, pid: %d)", term.fd, term.pid);

  server.on('connection', function (socket) {
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
//  io = io.listen(server, {
//    log: false
//  });
//
//  io.sockets.on('connection', function(sock) {
//    socket = sock;
//
//    socket.on('data', function(data) {
//      if (stream) stream.write('IN: ' + data + '\n-\n');
//      term.write(data);
//    });
//
//    socket.on('disconnect', function() {
//      socket = null;
//    });
//
//    while (buff.length) {
//      socket.emit('data', buff.shift());
//    }
//  });
};

/**
 * @param {Socket} s
 * @param {object} ss
 * @returns {void}
 */
exports.onConnection = function (s, ss) {
  "use strict";

  console.log('onConnection');

//  console.log(s);


  socket = s;
//  sockets = ss;

  socket.on('data', function (data) {
    console.log("socket.on data: " + data);

    if (stream) stream.write('IN: ' + data + '\n-\n');
    term.write(data);
  });

  socket.on('disconnect', function () {
    console.log("socket.on('disconnect'");
    socket = null;
  });

  while (buff.length) {
    socket.emit('data', buff.shift());
  }
};


//exports.setup = setup;
//exports.onConnection = onConnection;


