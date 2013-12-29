/**
 * Created by tobysuggate on 23/12/13.
 */


var Editor = Editor || {};

//Editor.socket = null;
Editor.socket = io.connect('http://localhost');


var gEditor;




//Editor.initEditorSocket = function() {
//  "use strict";

//  Editor.socket = io.connect('http://localhost');
//  console.log("connect editor.js");

  Editor.socket.on('news', function(data) {
    console.log('editor on news: ');
    console.log(data);
    Editor.socket.emit('my other event', { my: 'data' });
  });

  Editor.socket.on('res_open_file', function(data) {
//    console.log('res_open_file: ' + data);
    console.log('res_open_file: ' + data.fileName);
//    console.log('content: ' + data.content);

    openFile(data.fileName, data.content);
  });
//};


/**
 *  init gEditor
 */
$( document ).ready(function() {
  "use strict";

  if ($('#editor').length) {
    gEditor = ace.edit("editor");
    setUpEditor();

//    App.requestOpenFile("");
  }

});


function setCurrentFile(name) {
  "use strict";

  if (U.validStr(name)) {
    location.hash = name;
    document.title = U.removePath(name);
  }
  else {
    console.log("failed to set current file: null string");
  }
}

function getCurrentFile() {
  "use strict";

  if (U.validStr(location.hash.slice(1))) {
    return location.hash.slice(1);
  }
  else {
    return "";
  }
}



function openFile(file, content) {
  "use strict";

  console.log('openFile(res)');

  if (U.validStr(file)) {
    setCurrentFile(file);
  }

  if (U.validStr(getCurrentFile())) {

//    console.log("setValue: " + content);

    setMode(getCurrentFile());
    gEditor.setValue(content);
    gEditor.clearSelection();
    gEditor.scrollToLine(0);

    document.title = U.removePath(getCurrentFile());

    var UndoManager = ace.require("ace/undomanager").UndoManager;
    gEditor.getSession().setUndoManager(new UndoManager());
  }
  else {
    console.log("invalid current file");
  }

}

console.log("after openFile");


function setUpEditor() {
  "use strict";

  gEditor.setTheme("ace/theme/monokai");
//  gEditor.setTheme("ace/theme/solarized_dark");

  gEditor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true
  });

  setHotKeys();
}


function setHotKeys() {
  "use strict";

  gEditor.commands.addCommand({
    name: 'save',
    bindKey: {win: 'Ctrl-S', mac: 'Command-S'},
    exec: function () {
      saveFile();
    }
  });

  gEditor.commands.addCommand({
    name: 'build',
    bindKey: {win: 'Ctrl-B', mac: 'Command-B'},
    exec: function () {
      var command = "ghc " + getCurrentFile();

      console.log('runCommand("' + command + '");');

      runCommand(command);
    }
  });
}


/**
 * @param {string} fileName
 */
function setMode(fileName) {
  "use strict";

  var modelist = ace.require('ace/ext/modelist');
  var mode = modelist.getModeForPath(fileName).mode;

  if (U.validStr(mode)) {
    gEditor.session.setMode(mode);
  }
  else {
    gEditor.session.setMode("ace/mode/html");
  }
}

/**
 *  init App.socket
 */
//(function() {
//  "use strict";
//
////  console.log("editor socket setup");
//
////  App.setupServerSocket();
//  Editor.initEditorSocket();
////  console.log(App.socket);
//
//
////  App.socket.on('news', function(data) {
////    console.log(data);
////    App.socket.emit('my other event', { my: 'data' });
////  });
////
////  App.socket.on('res_open_file', function(data) {
//////    console.log('res_open_file: ' + data);
////    console.log('res_open_file: ' + data.fileName);
//////    console.log('content: ' + data.content);
////
////    openFile(data.fileName, data.content);
////  });
//
//})();