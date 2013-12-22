/**
 * Created by tobysuggate on 22/12/13.
 */

var express = require("express")
  , user = require("./routes/user")
  , http = require("http")
  , path = require("path")
  , wd = require("./walkDirectory")
  , u = require("./util")
  , fs = require("fs");


var settingsFile = process.env.HOME + "/.textServ";

var defaultSettings = {
  folder: process.env.HOME + "/Desktop"
};


exports.saveFile = saveFile;
exports.openFile = openFile;
exports.openFolder = openFolder;


function createDefaultSettingsFile() {
  if (!fs.existsSync(settingsFile)) {
    var content = JSON.stringify(defaultSettings, null, 4);

    fs.writeFileSync(settingsFile, content);
  }
}


function readSetting(name) {
  var setting = null;

  if (!fs.existsSync(settingsFile)) {
    createDefaultSettingsFile();
  }

  console.log("settingsFile: " + settingsFile);

  var data = fs.readFileSync(settingsFile);

  console.log(data.toString());

  var settings = JSON.parse(data);
  setting = settings[name];

  return setting;
}


function writeSetting(name, value) {
  if (!fs.existsSync(settingsFile)) {
    createDefaultSettingsFile();
  }


  var data = fs.readFileSync(settingsFile);

  if (data) {
    var settings = JSON.parse(data);
    settings[name] = value;

    var content = JSON.stringify(settings, null, 4);
    fs.writeFileSync(settingsFile, content);
  }

  

}


function openFile(req, res) {
  readFile(req.query.filename, res);
}


function openFolder(req, res) {
  var folder;
  folder = req.query.folderName;
  if (u.badString(folder)) {
    folder = readSetting('folder');


//    if (fs.existsSync('/Users/tobysuggate/Documents/Repos/CppDependencies/workspace/Dependancies')) {
//      folder = '/Users/tobysuggate/Documents/Repos/CppDependencies/workspace/Dependancies';
//    } else {
//      folder = process.env.HOME + "/Desktop";
//    }
  }
  readFolder(folder, res);

}


function saveFile(req, res) {
  var file = req.body.filename;
  var content = req.body.content;

  if (u.okString(file) && u.okString(content)) {
    writeFile(file, content);
  }
  else {
    console.log("/_save_file received invalid strings");
  }
  res.send("wrote file: " + file);
}


function writeFile(file, content) {
  fs.writeFileSync(file, content);
  console.log("wrote file: " + file);
}


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


function readFolder(folder, response) {
  if (u.okString(folder)) {
    wd.getDirectoryList(folder, response);
    writeSetting('folder', folder);
  }
}

