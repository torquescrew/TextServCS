/**
 * Created by tobysuggate on 22/12/13.
 */

"use strict";


var term = term || {};

var express = require("express")
  , fs = require("fs")
  , pty = require('pty.js')
  , io = require('socket.io')
  , terminal = require('term.js');


var stream;
if (process.argv[2] === '--dump') {
  stream = fs.createWriteStream(__dirname + '/dump.log');
}


term.mBuff = [];
term.mTerm = null;
term.mServer = null;
term.mSocket = null;

/**
 * @param {Server} server
 */
term.setup = function (server) {
  term.mServer = server;

  term.mTerm = pty.fork(process.env.SHELL || "sh", [], {
    name: (fs.existsSync("/usr/share/terminfo/x/xterm-256color") ? "xterm-256color" : "xterm"),
    cols: 80,
    rows: 24,
    cwd: process.env.HOME
  });

  term.mTerm.on("data", function (data) {
    if (stream) {
      stream.write("OUT: " + data + "\n-\n");
    }
    return !term.mSocket
      ? term.mBuff.push(data)
      : term.mSocket.emit('data', data);
  });

  console.log("" + "Created shell with pty master/slave" + " pair (master: %d, pid: %d)", term.fd, term.pid);

  term.mServer.on('connection', function (socket) {
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
};

/**
 * @param {Socket} socket
 * @returns {void}
 */
term.onConnection = function (socket) {
  term.mSocket = socket;

  term.mSocket.on('data', function (data) {
    if (stream) stream.write('IN: ' + data + '\n-\n');
    term.mTerm.write(data);
  });

  term.mSocket.on('disconnect', function () {
    term.mSocket = null;
  });

  while (term.mBuff.length) {
    term.mSocket.emit('data', term.mBuff.shift());
  }
};

exports.setup = term.setup;
exports.onConnection = term.onConnection;


