/**
 * Created by tobysuggate on 3/01/14.
 */

"use strict";

var serv = serv || {};

/** @type {Socket} */
serv.mSocket = null;


/**
 * @param {Socket} socket
 * @returns {serv}
 */
serv.setSocket = function (socket) {
  serv.mSocket = socket;

  serv.setupHandlers();

  return serv;
};


/**
 * @returns {void}
 */
serv.setupHandlers = function () {
  serv.mSocket.on('read_setting_res', function (value) {
    console.log(value);
  });

};


//serv.queryBrowserOpen = function () {
//  serv.checkSocket();
//
//  serv.mSocket.emit('read_setting', { name: 'browser_open' });
//};
//
//
//serv.queryTerminalOpen = function () {
//  serv.checkSocket();
//
//  serv.mSocket.emit ('read_setting', { name: 'terminal_open' });
//};


serv.checkSocket = function () {
  if (!serv.mSocket) {
    alert("Serv.mSocket == null");
  }
};


/** @type {number} */
serv.mPageLoadTime = new Date().getTime();


/**
 * @returns {string}
 */
serv.createId = function () {
  return (new Date().getTime() - serv.mPageLoadTime).toString();
};


/**
 * This function assumes that fio[funcName] exists on server
 *
 * @param {string} funcName
 * @param {Array.<*>} args
 * @param {function=} callback (optional)
 */
serv.run = function (funcName, args, callback) {
  if (serv.mSocket == null) {
    throw new Error('serv.mSocket is not set')
  }

  var taskId = serv.createId();

  serv.mSocket.on(taskId, function (result) {
    if (callback) {
      callback(result);
    }

    serv.mSocket.removeListener(taskId);
  });

  serv.mSocket.emit('task', { id: taskId, name: funcName, args: args });
};