"use strict";

function okString(str) {
  return (str != null) && str.length > 0;
}

function badString(str) {
  return !(okString(str));
}

function tailAfterLast(str, char) {
  var i;
  i = str.lastIndexOf(char);
  if (i > 0) {
    return str.slice(i + 1);
  } else {
    return "";
  }
}

function tailAfterFirst(str, char) {
  var i;
  i = str.indexOf(char);
  if (i > 0) {
    return str.slice(i + 1);
  } else {
    return "";
  }
}

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function stripFolder(path) {
  return tailAfterLast(path, '/');
}


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
