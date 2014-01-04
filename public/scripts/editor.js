/**
 * Created by tobysuggate on 23/12/13.
 */
"use strict";

var Editor = Editor || {};

Editor.mSocket = io.connect('http://localhost');
Editor.mEditor = null;


Editor.setupHandlers = function () {
  Editor.mSocket.on('news', function(data) {
    console.log('editor on news: ');
    console.log(data);
    Editor.mSocket.emit('my other event', { my: 'data' });
  });

  Editor.mSocket.on('res_open_file', function(data) {
    console.log('res_open_file: ' + data.fileName);
    Editor.openFile(data.fileName, data.content);
  });


  var fun = function(num) {
    console.log("num: " + num);
  };

  console.log("logging fun:");
  console.log(fun);

  Editor.mSocket.emit('run', { func: "(" + fun.toString() + ")" });

//  Editor.mSocket.emit('read_setting', )
};


/**
 * @param {string} name
 */
Editor.setCurrentFile = function (name) {
  if (u.validStr(name)) {
    location.hash = name;
    document.title = u.removePath(name);
  }
  else {
    console.log("failed to set current file: null string");
  }
};


/**
 * @returns {string}
 */
Editor.getCurrentFile = function () {
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
Editor.openFile = function (file, content) {
  console.log('openFile(res)');

  if (u.validStr(file)) {
    Editor.setCurrentFile(file);
  }

  if (u.validStr(Editor.getCurrentFile())) {
    setMode(Editor.getCurrentFile());
    Editor.mEditor.setValue(content);
    Editor.mEditor.clearSelection();
    Editor.mEditor.scrollToLine(0);

    document.title = u.removePath(Editor.getCurrentFile());

    var UndoManager = ace.require("ace/undomanager").UndoManager;
    Editor.mEditor.getSession().setUndoManager(new UndoManager());
  }
  else {
    console.log("invalid current file");
  }
};


Editor.setUpEditor = function () {
//  Editor.mEditor.setTheme("ace/theme/monokai");
  Editor.mEditor.setTheme("ace/theme/kr_theme");
//  gEditor.setTheme("ace/theme/solarized_dark");

//  Editor.mEditor.setOptions({
//    enableBasicAutocompletion: true,
//    enableSnippets: true
//  });

  Editor.setHotKeys();
};


Editor.setHotKeys = function () {
  Editor.mEditor.commands.addCommand({
    name: 'save',
    bindKey: {win: 'Ctrl-S', mac: 'Command-S'},
    exec: function () {
      saveFile();
    }
  });

  Editor.mEditor.commands.addCommand({
    name: 'build',
    bindKey: {win: 'Ctrl-B', mac: 'Command-B'},
    exec: function () {
      var command = "ghc " + Editor.getCurrentFile();

      console.log('runCommand("' + command + '");');

      runCommand(command);
    }
  });
}


/**
 * @param {string} fileName
 */
function setMode(fileName) {
  var modelist = ace.require('ace/ext/modelist');
  var mode = modelist.getModeForPath(fileName).mode;

  if (u.validStr(mode)) {
    Editor.mEditor.session.setMode(mode);
  }
  else {
    Editor.mEditor.session.setMode("ace/mode/html");
  }
}

Editor.setupHandlers();

$( document ).ready(function() {
  if ($('#editor').length) {
    Editor.mEditor = ace.edit("editor");
    Editor.setUpEditor();
  }
});