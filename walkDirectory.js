"use strict";

var fs = require('fs')
  , u = require('./public/scripts/utility')
  , underscore = require('underscore');


/** @type {string[]} */
var ignore = [".hi", ".o", ".hs~"];

/**
 * @param {string} path
 * @returns {boolean}
 */
function isDir(path) {
  return u.okString(path) && u.stripFolder(path)[0] !== '.' && fs.statSync(path).isDirectory();
}

/**
 * @param {string} path
 * @returns {boolean}
 */
function isFile(path) {
  return u.okString(path) && fs.statSync(path).isFile() && !shouldIgnore(path);
}

/**
 * @param {string} path
 * @returns {boolean}
 */
function shouldIgnore(path) {
  return underscore.some(ignore, function (ext) {
    return u.endsWith(path, ext);
  });
}

/**
 * @param {string} folder
 * @param {object} response
 * @returns {void}
 */
function getDirectoryList(folder, response) {
  var html = '';
  var walk = function (folder) {
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
  };
  walk(folder);
  response.json({
    folderName: folder,
    content: html
  });
}

if (typeof exports !== "undefined" && exports !== null) {
  exports.getDirectoryList = getDirectoryList;
}
