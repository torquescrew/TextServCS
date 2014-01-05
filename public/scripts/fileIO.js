/**
 * Created by tobysuggate on 22/12/13.
 */

"use strict";

var fio = fio || {};


if (typeof exports !== 'undefined') {

  var express = require("express")
    , http = require("http")
    , path = require("path")
    , wd = require("./../../walkDirectory")
    , u = require("./utility")
    , fs = require("fs");


  fio.mSockets = null;
  fio.mSettingsFile = process.env.HOME + "/.textServ";

  fio.defaultSettings = {
    folder: process.env.HOME + "/Desktop"
  };
}


fio.createDefaultSettingsFile = function () {
  if (!fs.existsSync(fio.mSettingsFile)) {
    var content = JSON.stringify(fio.defaultSettings, null, 4);

    fs.writeFileSync(fio.mSettingsFile, content);
  }
};


/**
 * @param {string} name
 * @returns {*}
 */
fio.readSetting = function (name) {
  var setting;

  if (!fs.existsSync(fio.mSettingsFile)) {
    fio.createDefaultSettingsFile();
  }
  var data = fs.readFileSync(fio.mSettingsFile);

  var settings = JSON.parse(data);
  setting = settings[name];

  return setting;
};


/**
 * @param {string} name
 * @param {*} value
 * @returns {boolean}
 */
fio.writeSetting = function (name, value) {
  if (!fs.existsSync(fio.mSettingsFile)) {
    fio.createDefaultSettingsFile();
  }
  var data = fs.readFileSync(fio.mSettingsFile);

  if (data) {
    var settings = JSON.parse(data);
    settings[name] = value;

    var content = JSON.stringify(settings, null, 4);
    fs.writeFileSync(fio.mSettingsFile, content);

    return true;
  }
  return false;
};



fio.readFileSync = function (file) {
  var content = fs.readFileSync(file);

  return { file: file, content: content.toString() };
};


/**
 * @param {object} req
 * @param {object} res
 */
fio.openFile = function (req, res) {
  fio.readFile(req.query.filename, res);
};


/**
 * @param {object} req
 * @param {object} res
 */
fio.openFolder = function (req, res) {
  var folder;
  folder = req.query.folderName;
  if (u.badString(folder)) {
    folder = fio.readSetting('folder');
  }
  fio.readFolder(folder, res);
};

/**
 * @param {Request} req
 * @param {object} res
 */
fio.saveFile = function (req, res) {
  var file = req.body.filename;
  var content = req.body.content;

  if (u.okString(file) && u.okString(content)) {
    fio.writeFile(file, content);
  }
  else {
    console.log("/_save_file received invalid strings");
  }
  res.send("wrote file: " + file);
};


/**
 * @param {string} file
 * @param {string} content
 */
fio.writeFile = function (file, content) {
  fs.writeFileSync(file, content);
  console.log("wrote file: " + file);
};


/**
 * @param {string} file
 * @param {object} response
 */
fio.readFile = function (file, response) {
  fs.readFile(file, function (err, data) {
    if (err) {
      throw err;
    }
    response.json({
      filename: file,
      content: data.toString()
    });
  });
};


/**
 * @param {string} folder
 * @param {object} response
 */
fio.readFolder = function (folder, response) {
  if (u.okString(folder)) {
    wd.getDirectoryList(folder, response);
    fio.writeSetting('folder', folder);
  }
};


/**
 * @param {string} fileName
 */
fio.openFileRes = function (fileName) {
  var data = "";

  if (fs.existsSync(fileName)) {
    data = fs.readFileSync(fileName);

    if (u.okString(fileName) && u.okString(data.toString())) {
      console.log('res_open_file ' + fileName);

      fio.mSockets.emit('res_open_file', {
        fileName: fileName,
        content: data.toString()
      });
    }
  }
};


/**
 * @param {Socket} socket
 * @param {object} sockets
 */
fio.setSocket = function(socket, sockets) {
  fio.mSockets = sockets;
  fio.initSocketHandlers(socket);
};


/**
 * @param {Socket} socket
 */
fio.initSocketHandlers = function (socket) {
  socket.on('req_open_file', function (data) {
    console.log("req_open_file: " + data.fileName);
//    fio.openFileRes(data.fileName);

    fio.mSockets.emit('req_open_file', data);
  });

  socket.on('write_setting', function (data) {
    fio.writeSetting(data.name, data.value);
  });

  socket.on('read_setting', function (data) {
    var value = fio.readSetting(data.name);
    socket.emit('read_setting_res', value);
  });
};


if (typeof exports !== 'undefined') {
  exports.readSetting = fio.readSetting;
  exports.writeSetting = fio.writeSetting;
  exports.openFile = fio.openFile;
  exports.openFolder = fio.openFolder;
  exports.saveFile = fio.saveFile;
  exports.writeFile = fio.writeFile;
  exports.readFile = fio.readFile;
  exports.readFolder = fio.readFolder;
  exports.openFileRes = fio.openFileRes;
  exports.setSocket = fio.setSocket;
  exports.initSocketHandlers = fio.initSocketHandlers;
  exports.readFileSync = fio.readFileSync;
}