"use strict";

var fs = require('fs'),
  u = require('./util'),
  underscore = require('underscore');

var ignore = [".hi", ".o", ".hs~"];

function isDir(path) {
  return u.okString(path) && u.stripFolder(path)[0] !== '.' && fs.statSync(path).isDirectory();
}

function isFile(path) {
  return u.okString(path) && fs.statSync(path).isFile() && !shouldIgnore(path);
}

function shouldIgnore(path) {
  return underscore.some(ignore, function (ext) {
    return u.endsWith(path, ext);
  });
}

function getDirectoryList(folder, response) {
  var html, walk;
  html = '';
  walk = function (folder) {
    var item, path, _i, _len, _ref, _results;
    _ref = fs.readdirSync(folder);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      path = folder + '/' + item;
      if (isDir(path)) {
        html += "<li class=\"folder\">" + u.stripFolder(path) + "/<ul>";
        walk(path);
        html += "</ul></li>";
      } else if (isFile(path)) {
        html += "<li class=\"file\" id=" + path + ">" + u.stripFolder(path) + "</li>";
      }
      _results.push(html);
    }
    return _results;
  };
  walk(folder);
  return response.json({
    folderName: folder,
    content: html
  });
}

if (typeof exports !== "undefined" && exports !== null) {
  exports.getDirectoryList = getDirectoryList;
}
