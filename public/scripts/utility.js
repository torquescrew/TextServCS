/**
 * Created by tobysuggate on 30/11/13.
 * This file is shared between server and client
 */

"use strict";

/** @type {u} */
var u = u || {};

/**
 * @param {string} string
 * @returns {boolean}
 */
u.validStr = function (string) {
  return (typeof string !== 'undefined' && string.length > 0);
};


/**
 * @param {string} string
 * @param {string} char
 * @returns {string}
 */
u.tailAfter = function (string, char) {
  var i = string.lastIndexOf(char);
  if (i > 0) {
    return string.slice(i + 1);
  }
  return "";
};


/**
 * @param {*} value
 * @returns {boolean}
 */
u.defined = function (value) {
  return typeof value !== 'undefined';
};


/**
 * @param {string} file
 * @returns {string}
 */
u.removePath = function (file) {
  return u.tailAfter(file, '/');
};


/**
 * @param {string} file
 * @returns {string}
 */
u.fileExtension = function (file) {
  return u.tailAfter(file, '.');
};


/**
 * @param {string} file
 * @returns {string}
 */
u.modeForFile = function (file) {
  var ext = u.fileExtension(file);

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

/**
 * @param {string} str
 * @returns {boolean}
 */
u.okString = function (str) {
  return (str != null) && str.length > 0;
};

/**
 * @param {string} str
 * @returns {boolean}
 */
u.badString = function (str) {
  return !(u.okString(str));
};

/**
 * @param {string} str
 * @param {string} char
 * @returns {string}
 */
u.tailAfterLast = function (str, char) {
  var i;
  i = str.lastIndexOf(char);
  if (i > 0) {
    return str.slice(i + 1);
  }
  return "";
};

/**
 * @param {string} str
 * @param {string} char
 * @returns {string}
 */
u.tailAfterFirst = function (str, char) {
  var i;
  i = str.indexOf(char);
  if (i > 0) {
    return str.slice(i + 1);
  }
  return "";
};

/**
 * @param {string} str
 * @param {string} suffix
 * @returns {boolean}
 */
u.endsWith = function (str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
};


/**
 * @param {string} path
 * @returns {string}
 */
u.stripFolder = function (path) {
  return u.tailAfterLast(path, '/');
};

/**
 * @param {string} fileName
 * @returns {string}
 */
u.removeTopFolder = function (fileName) {
  return u.tailAfterFirst(fileName, '/');
};


/**
 * @param {function} functionToCheck
 * @returns {boolean}
 */
u.isFunction = function (functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};


/**
 * @param {Array} array
 * @returns {*}
 */
u.last = function (array) {
  return array[array.length-1];
};


/**
 * @returns {boolean}
 */
u.exportDefined = function () {
  return typeof exports !== "undefined" && exports !== null;
};


if (u.exportDefined()) {
  exports.okString = u.okString;
  exports.badString = u.badString;
  exports.tailAfterLast = u.tailAfterLast;
  exports.tailAfterFirst = u.tailAfterFirst;
  exports.removeTopFolder = u.removeTopFolder;
  exports.stripFolder = u.stripFolder;
  exports.endsWith = u.endsWith;
}


