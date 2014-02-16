/**
 * Created by tobysuggate on 22/12/13.
 */
"use strict";

var s = require('./public/scripts/strings').s;

var fio = fio || {};

if (typeof exports !== 'undefined') {
  var express = require("express"),
      http = require("http"),
      path = require("path"),
      wd = require("./walkDirectory"),
      u = require("./public/scripts/utility"),
      fs = require("fs");

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

  console.log(name);
  console.log(setting);

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


/**
 * @param {string} file
 * @returns {{file: (String), content: (string)}}
 */
fio.readFileSync = function (file) {
  console.log(file);
  var stats = null;

  if (u.okString(file)) {
    stats = fs.statSync(file);
    console.log("is character device: " + stats.isCharacterDevice());
  }



  if (stats && stats.isFile()) {
    var content = fs.readFileSync(file);

    return { file: file, content: content.toString() };
  }

  console.log(file + " is not a file");

  return { file: file, content: file + " is not a file." };
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
 * @returns {string}
 */
fio.getHomeFolder = function () {
  return process.env.HOME;
};


if (typeof exports !== 'undefined') {
  exports.readSetting = fio.readSetting;
  exports.writeSetting = fio.writeSetting;
  exports.readFileSync = fio.readFileSync;
  exports.writeFile = fio.writeFile;
  exports.getHomeFolder = fio.getHomeFolder;
}