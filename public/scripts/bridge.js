/*global io, u, alert */
/**
 * Created by tobysuggate on 19/01/14.
 */

"use strict";

function Bridge () {}


Bridge.prototype.mSocket = io.connect('http://localhost');

/**
 * @param {string} id
 * @param {function} func
 */
Bridge.prototype.on = function (id, func) {
  this.mSocket.on(id, func);
};

/**
 * @param {string} id
 * @param {object} data
 */
Bridge.prototype.emit = function (id, data) {
  this.mSocket.emit(id, data);
};

/**
 * @param {string} id
 * @param {object} data
 */
Bridge.prototype.toAllClients = function (id, data) {
  this.mSocket.emit('emitToAll', { id: id, data: data });
};

/**
 * This function assumes that fio[funcName] exists on server
 *
 * @param {string} funcName
 * @param {Array.<*>} args
 * @param {function=} callback (optional)
 */
Bridge.prototype.run = function (funcName, args, callback) {
  var self = this;

  if (self.mSocket === null) {
    throw new Error('serv.mSocket is not set');
  }

  var taskId = u.createId();

  self.mSocket.on(taskId, function (result) {
    if (callback) {
      callback(result);
    }

    self.mSocket.removeListener(taskId);
  });

  self.mSocket.emit('task', { id: taskId, name: funcName, args: args });
};