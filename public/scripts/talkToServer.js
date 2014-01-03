/**
 * Created by tobysuggate on 3/01/14.
 */

"use strict";

var Serv = Serv || {};

/** @type {Socket} */
Serv.mSocket = null;


/**
 * @param {Socket} socket
 * @returns {Serv}
 */
Serv.setSocket = function (socket) {
  Serv.mSocket = socket;

  Serv.setupHandlers();

  return Serv;
};


/**
 * @returns {void}
 */
Serv.setupHandlers = function () {
  Serv.mSocket.on('read_setting_res', function (value) {
    console.log(value);
  });

};


Serv.queryBrowserOpen = function () {
  Serv.checkSocket();

  Serv.mSocket.emit('read_setting', { name: 'browser_open' });
};


Serv.queryTerminalOpen = function () {
  Serv.checkSocket();

  Serv.mSocket.emit ('read_setting', { name: 'terminal_open' });
};


Serv.checkSocket = function () {
  if (!Serv.mSocket) {
    alert("Serv.mSocket == null");
  }
};