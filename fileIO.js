/**
 * Created by tobysuggate on 22/12/13.
 */

"use strict";

var express = require("express"),
  user = require("./routes/user"),
  http = require("http"),
  path = require("path"),
  wd = require("./walkDirectory"),
  u = require("./util"),
  fs = require("fs");

var gSockets;
var gSettingsFile = process.env.HOME + "/.textServ";

var defaultSettings = {
  folder: process.env.HOME + "/Desktop"
};


//exports.saveFile = saveFile;
//exports.openFile = openFile;
//exports.openFolder = openFolder;
//exports.openFileRes = openFileRes;
//exports.setSocket = setSocket;


function createDefaultSettingsFile() {
  if (!fs.existsSync(gSettingsFile)) {
    var content = JSON.stringify(defaultSettings, null, 4);

    fs.writeFileSync(gSettingsFile, content);
  }
}


/**
 * @param {string} name
 * @returns {*}
 */
function readSetting(name) {
  var setting;

  if (!fs.existsSync(gSettingsFile)) {
    createDefaultSettingsFile();
  }
  var data = fs.readFileSync(gSettingsFile);

  var settings = JSON.parse(data);
  setting = settings[name];

  return setting;
}

/**
 * @param {string} name
 * @param value
 */
function writeSetting(name, value) {
  if (!fs.existsSync(gSettingsFile)) {
    createDefaultSettingsFile();
  }
  var data = fs.readFileSync(gSettingsFile);

  if (data) {
    var settings = JSON.parse(data);
    settings[name] = value;

    var content = JSON.stringify(settings, null, 4);
    fs.writeFileSync(gSettingsFile, content);
  }
}

/**
 * @param {object} req
 * @param {object} res
 */
exports.openFile = function (req, res) {
  readFile(req.query.filename, res);
};


/**
 * @param {object} req
 * @param {object} res
 */
exports.openFolder = function (req, res) {
  var folder;
  folder = req.query.folderName;
  if (u.badString(folder)) {
    folder = readSetting('folder');
  }
  readFolder(folder, res);
};

/**
 * @param {Request} req
 * @param {object} res
 */
exports.saveFile = function (req, res) {
  var file = req.body.filename;
  var content = req.body.content;

  if (u.okString(file) && u.okString(content)) {
    writeFile(file, content);
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
function writeFile(file, content) {
  fs.writeFileSync(file, content);
  console.log("wrote file: " + file);
}

/**
 * @param {string} file
 * @param {object} response
 */
function readFile(file, response) {
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


/**
 * @param {string} folder
 * @param {object} response
 */
function readFolder(folder, response) {
  if (u.okString(folder)) {
    wd.getDirectoryList(folder, response);
    writeSetting('folder', folder);
  }
}

/**
 * @param {string} fileName
 */
function openFileRes(fileName) {
  "use strict";

  var data = "";

  if (fs.existsSync(fileName)) {
    data = fs.readFileSync(fileName);


    if (u.okString(fileName) && u.okString(data.toString())) {
      console.log('res_open_file ' + fileName);

      gSockets.emit('res_open_file', {
        fileName: fileName,
        content: data.toString()
      });
    }
  }
}


/**
 * @param {Socket} socket
 * @param {object} sockets
 */
exports.setSocket = function(socket, sockets) {
  "use strict";

  gSockets = sockets;
  initSocketHandlers(socket);
};


/**
 * @param {Socket} socket
 */
function initSocketHandlers(socket) {
  "use strict";

  socket.on('req_open_file', function (data) {
    console.log("req_open_file: " + data.fileName);
    openFileRes(data.fileName);
  });
}
