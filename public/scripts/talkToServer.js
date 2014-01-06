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


serv.queryBrowserOpen = function () {
  serv.checkSocket();

  serv.mSocket.emit('read_setting', { name: 'browser_open' });
};


serv.queryTerminalOpen = function () {
  serv.checkSocket();

  serv.mSocket.emit ('read_setting', { name: 'terminal_open' });
};


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


///**
// * @param {function} func
// * @param {function} callback
// */
//serv.run = function (func, callback) {
//  var taskId = serv.createId();
//
//  serv.mSocket.on(taskId, function (result) {
//    callback(result);
//    serv.mSocket.removeListener(taskId);
//  });
//
//  serv.mSocket.emit('task', { id: taskId, func: "(" + func.toString() + ")" });
//};


///**
// * Beware:
// * - takes variable number of parameters, callback function is last
// * - this function assumes that fio[funcName] exists on server
// *
// * @param {string} funcName
// */
//serv.run2 = function (funcName) {
//  var taskId = serv.createId();
//  var args = Array.prototype.slice.call(arguments, 1);
//  var callback = u.isFunction(u.last(args)) ? args.pop() : null;
//
//  serv.mSocket.on(taskId, function (result) {
//    if (callback) {
//      callback(result);
//    }
//
//    serv.mSocket.removeListener(taskId);
//  });
//
//  serv.mSocket.emit('task2', { id: taskId, name: funcName, args: args });
//};


/**
 * This function assumes that fio[funcName] exists on server
 *
 * @param {string} funcName
 * @param {Array.<*>} args
 * @param {function=} callback (optional)
 */
serv.run = function (funcName, args, callback) {
  var taskId = serv.createId();

  serv.mSocket.on(taskId, function (result) {
    if (callback) {
      callback(result);
    }

    serv.mSocket.removeListener(taskId);
  });

  serv.mSocket.emit('task2', { id: taskId, name: funcName, args: args });
};