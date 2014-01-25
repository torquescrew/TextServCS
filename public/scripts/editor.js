/*global io, Bridge, u, ace, s */
/**
 * Created by tobysuggate on 23/12/13.
 */
"use strict";

var bridge = new Bridge();

var edit = edit || {};

edit.mEditor = null;


edit.setupHandlers = function () {
  bridge.on(s.requestOpenFile, function (data) {
    bridge.run('readFileSync', [data.fileName], function (res) {
      edit.openFile2(res.file, res.content);
    });
  });

  bridge.run('readSetting', ['file'], function (fileName) {
    bridge.run('readFileSync', [fileName], function (res) {
      edit.openFile2(res.file, res.content);
    });
  });
};


/**
 * @param {string} name
 */
edit.setCurrentFile = function (name) {
  if (u.validStr(name)) {
    location.hash = name;
    document.title = u.removePath(name);

    bridge.run('writeSetting', ['file', name], function (res) {
      console.log(res);
    });
  }
  else {
    console.log("failed to set current file: null string");
  }
};


/**
 * @returns {string}
 */
edit.getCurrentFile = function () {
  if (u.validStr(location.hash.slice(1))) {
    return location.hash.slice(1);
  }
  else {
    return "";
  }
};


/**
 * @param {function} callback
 */
edit.getCurrentFile = function(callback) {
  bridge.run('readSetting', ['file'], callback);
};


/**
 * @param {string} file
 * @param {string} content
 */
edit.openFile2 = function (file, content) {
  if (u.validStr(file)) {

    bridge.emit('setWindowTitle', { title: file });

    edit.setMode(file);
    edit.mEditor.setValue(content);
    edit.mEditor.clearSelection();
    edit.mEditor.scrollToLine(0);

    var UndoManager = ace.require("ace/undomanager").UndoManager;
    edit.mEditor.getSession().setUndoManager(new UndoManager());

    edit.setCurrentFile(file);
  }
  else {
    console.log("invalid current file");
  }
};


/**
 * Themes: "ace/theme/monokai",
 * "ace/theme/kr_theme",
 * "ace/theme/solarized_dark"
 */
edit.setUpEditor = function () {
  edit.mEditor.setTheme("ace/theme/kr_theme");

  edit.setHotKeys();
};


edit.setHotKeys = function () {
  edit.mEditor.commands.addCommand({
    name: 'save',
    bindKey: {win: 'Ctrl-S', mac: 'Command-S'},
    exec: function () {
      edit.saveFile();
    }
  });

  edit.mEditor.commands.addCommand({
    name: 'build',
    bindKey: {win: 'Ctrl-B', mac: 'Command-B'},
    exec: function () {
      //TODO
    }
  });
};


edit.saveFile = function () {
  edit.getCurrentFile(function (file) {
    var content = edit.mEditor.getValue();

    bridge.run('writeFile', [file, content]);
  });
};


/**
 * @param {string} fileName
 */
edit.setMode = function (fileName) {
  var modelist = ace.require('ace/ext/modelist');
  var mode = modelist.getModeForPath(fileName).mode;

  if (u.validStr(mode)) {
    edit.mEditor.session.setMode(mode);
  }
  else {
    edit.mEditor.session.setMode("ace/mode/html");
  }
};

