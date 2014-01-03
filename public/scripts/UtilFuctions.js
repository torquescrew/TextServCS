/**
 * Created by tobysuggate on 30/11/13.
 */

"use strict";


/** @type {U} */
var U = U || {};


/**
 * @param {string} string
 * @returns {boolean}
 */
U.validStr = function (string) {
  return (typeof string !== 'undefined' && string.length > 0);
};


/**
 * @param {string} string
 * @param {string} char
 * @returns {string}
 */
U.tailAfter = function (string, char) {
  var i = string.lastIndexOf(char);
  if (i > 0) {
    return string.slice(i + 1);
  }
  return "";
};


/**
 * @param {string} file
 * @returns {string}
 */
U.removePath = function (file) {
  return U.tailAfter(file, '/');
};


/**
 * @param {string} file
 * @returns {string}
 */
U.fileExtension = function (file) {
  return U.tailAfter(file, '.');
};


/**
 * @param {string} file
 * @returns {string}
 */
U.modeForFile = function (file) {
  var ext = U.fileExtension(file);

  switch (ext) {
    case "clj": return "clojure";
    case "h": return "c_cpp";
    case "cpp": return "c_cpp";
    case "c": return "c_cpp";
    case "py": return "python";
    case "hs": return "haskell";
    case "js": return "javascript";
    case "scala": return "scala";
    case "iml": return "xml";
  }
  return ext;
};
