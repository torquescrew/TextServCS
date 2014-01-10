"use strict";

var fs = require('fs')
  , u = require('./public/scripts/utility')
  , underscore = require('underscore');

var walk = walk || {};


/** @type {string[]} */
walk.ignore = [".hi", ".o", ".hs~"];

/**
 * @param {string} path
 * @returns {boolean}
 */
walk.isDir = function (path) {
  return u.okString(path) && u.stripFolder(path)[0] !== '.' && fs.statSync(path).isDirectory();
};


/**
 * @param {string} path
 * @returns {boolean}
 */
walk.isFile = function (path) {
  return u.okString(path) && fs.statSync(path).isFile() && !walk.shouldIgnore(path);
};

/**
 * @param {string} path
 * @returns {boolean}
 */
walk.shouldIgnore = function (path) {
  return underscore.some(walk.ignore, function (ext) {
    return u.endsWith(path, ext);
  });
};

/**
 * @param {string} folder
 * @param {object} response
 * @returns {void}
 */
walk.getDirectoryList = function (folder, response) {
//  console.log(walk.getCurrentDirectory(folder));

//  var something = walk.getCurrentDirectory(folder);

  var html = '';
  var walkdir = function (folder) {
    var item, path, _i, _len, _ref, _results;
    _ref = fs.readdirSync(folder);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      path = folder + '/' + item;
      if (walk.isDir(path)) {
        html += "<li class=\"folder\">" + u.stripFolder(path) + "/<ul>";
        walkdir(path);
        html += "</ul></li>";
      }
      else if (walk.isFile(path)) {
        html += "<li class=\"file\" id=" + path + ">" + u.stripFolder(path) + "</li>";
      }
      _results.push(html);
    }
  };
  walkdir(folder);

//  console.log(html);

  response.json({
    folderName: folder,
    content: html
  });
};


/**
 * @param {string} folder
 * @returns {string}
 */
walk.getListForFolder = function (folder) {
  var html = '<ul>';

  var contents = fs.readdirSync(folder);
  contents.forEach(function (item) {
    var path = folder + '/' + item;
    if (walk.isDir(path)) {
      html += '<li class="folder" id="' + path + '">' + item + '/</li>';
    }
    else if (walk.isFile(path)) {
      html += '<li class="file" id="' + path + '">' + item + '</li>';
    }
  });

  html += '</ul>';

  return html;
};


if (typeof exports !== "undefined") {
  exports.getDirectoryList = walk.getDirectoryList;
  exports.getListForFolder = walk.getListForFolder;
}
