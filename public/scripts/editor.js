/**
 * Created by tobysuggate on 23/12/13.
 */
"use strict";

var edit = edit || {};

edit.mSocket = io.connect('http://localhost');
edit.mEditor = null;


edit.setupHandlers = function () {
  edit.mSocket.on('news', function (data) {
    console.log('editor on news: ');
    console.log(data);
    edit.mSocket.emit('my other event', { my: 'data' });
  });

  edit.mSocket.on('res_open_file', function (data) {
    console.log('res_open_file: ' + data.fileName);
    edit.openFile(data.fileName, data.content);
  });


  serv.setSocket(edit.mSocket);

//  serv.run(function () {
//    return fio.readSetting('folder');
//  }, function (result) {
//    console.log(result);
//  });


  serv.run2('readSetting', 'folder', function (res) {
    console.log('omg: ' + res);
  });


};


/**
 * @param {string} name
 */
edit.setCurrentFile = function (name) {
  if (u.validStr(name)) {
    location.hash = name;
    document.title = u.removePath(name);

//    serv.run(function () {
//      return fio.writeSetting('file', name);
//    }, function (res) {
//      console.log("current file set: " + name);
//      console.log(res);
//    });
    serv.run2('writeSetting', 'file', name);
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
 * @param {string} file
 * @param {string} content
 */
edit.openFile = function (file, content) {
  console.log('openFile(res)');

  if (u.validStr(file)) {
    edit.setCurrentFile(file);
  }

  if (u.validStr(edit.getCurrentFile())) {
    edit.setMode(edit.getCurrentFile());
    edit.mEditor.setValue(content);
    edit.mEditor.clearSelection();
    edit.mEditor.scrollToLine(0);

    document.title = u.removePath(edit.getCurrentFile());

    var UndoManager = ace.require("ace/undomanager").UndoManager;
    edit.mEditor.getSession().setUndoManager(new UndoManager());
  }
  else {
    console.log("invalid current file");
  }
};


edit.setUpEditor = function () {
//  Editor.mEditor.setTheme("ace/theme/monokai");
  edit.mEditor.setTheme("ace/theme/kr_theme");
//  gEditor.setTheme("ace/theme/solarized_dark");

//  Editor.mEditor.setOptions({
//    enableBasicAutocompletion: true,
//    enableSnippets: true
//  });

  edit.setHotKeys();
};


edit.setHotKeys = function () {
  edit.mEditor.commands.addCommand({
    name: 'save',
    bindKey: {win: 'Ctrl-S', mac: 'Command-S'},
    exec: function () {
      saveFile();
    }
  });

  edit.mEditor.commands.addCommand({
    name: 'build',
    bindKey: {win: 'Ctrl-B', mac: 'Command-B'},
    exec: function () {
      var command = "ghc " + Editor.getCurrentFile();

      console.log('runCommand("' + command + '");');

      runCommand(command);
    }
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


edit.setupHandlers();

$(document).ready(function () {
  if ($('#editor').length) {
    edit.mEditor = ace.edit("editor");
    edit.setUpEditor();
  }
});