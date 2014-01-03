"use strict";

/**
 * @param {string} str
 * @returns {boolean}
 */
function okString(str) {
  return (str != null) && str.length > 0;
}

/**
 * @param {string} str
 * @returns {boolean}
 */
function badString(str) {
  return !(okString(str));
}

/**
 * @param {string} str
 * @param {string} char
 * @returns {string}
 */
function tailAfterLast(str, char) {
  var i;
  i = str.lastIndexOf(char);
  if (i > 0) {
    return str.slice(i + 1);
  }
  return "";
}

/**
 * @param {string} str
 * @param {string} char
 * @returns {string}
 */
function tailAfterFirst(str, char) {
  var i;
  i = str.indexOf(char);
  if (i > 0) {
    return str.slice(i + 1);
  }
  return "";
}

/**
 * @param {string} str
 * @param {string} suffix
 * @returns {boolean}
 */
function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}


/**
 * @param {string} path
 * @returns {string}
 */
function stripFolder(path) {
  return tailAfterLast(path, '/');
}

/**
 * @param {string} fileName
 * @returns {string}
 */
function removeTopFolder(fileName) {
  return tailAfterFirst(fileName, '/');
}


if (typeof exports !== "undefined" && exports !== null) {
  exports.okString = okString;
  exports.badString = badString;
  exports.tailAfterLast = tailAfterLast;
  exports.tailAfterFirst = tailAfterFirst;
  exports.removeTopFolder = removeTopFolder;
  exports.stripFolder = stripFolder;
  exports.endsWith = endsWith;
}
