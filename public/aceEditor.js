/*global clearConsole: false, runCommand: false, alert: false, confirm: false, console: false, prompt: false, $: false, ace: false, U: false,
 setUpFileTree: false*/


var editor = null;

//function main() {
//  "use strict";
//
//  console.log("javascript main()");
//
//  editor = ace.edit("editor");
//  setUpEditor();
//
//  openFile();
////  openFolder();
//}
//$( document ).ready( main );

(function() {
  "use strict";

//  console.log("javascript main()");

  editor = ace.edit("editor");
  setUpEditor();

  openFile();
})();


function setUpEditor() {
  "use strict";

//  editor.setTheme("ace/theme/monokai");
  editor.setTheme("ace/theme/solarized_dark");

  editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true
  });

  setHotKeys();
}


function setHotKeys() {
  "use strict";

  editor.commands.addCommand({
    name: 'save',
    bindKey: {win: 'Ctrl-S', mac: 'Command-S'},
    exec: function () {
      saveFile();
    }
  });


  editor.commands.addCommand({
    name: 'build',
    bindKey: {win: 'Ctrl-B', mac: 'Command-B'},
    exec: function () {
      var command = "ghc " + getCurrentFile();

      console.log('runCommand("' + command + '");');

//    clearConsole();
      runCommand(command);
    }
  });
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


function resizeEditor() {
  "use strict";

  editor.resize();
}

function getEditor() {
  "use strict";

  return editor;
}


function saveFile() {
  "use strict";

  var fileName = getCurrentFile();
  var text = editor.getValue();

  if (U.validStr(text) && U.validStr(fileName)) {
    $.post('/_save_file', {
      filename: fileName,
      content: text
    }, function (data) {
      console.log('returned data(saveFile): ' + data);
    });
  }
}


function setMode(fileName) {
  "use strict";
  var modelist = ace.require('ace/ext/modelist');
  var mode = modelist.getModeForPath(fileName).mode;

  if (U.validStr(mode)) {
    editor.session.setMode(mode);
  }
  else {
    editor.session.setMode("ace/mode/html");
  }
}


function openFile(file) {
  "use strict";

  if (U.validStr(file)) {
    setCurrentFile(file);
  }

  if (U.validStr(getCurrentFile())) {
    $.getJSON('/_open_file', {
      filename: getCurrentFile()
    }, function (data) {
      setMode(getCurrentFile());
      editor.setValue(data.content);
      editor.clearSelection();
      editor.scrollToLine(0);

      document.title = U.removePath(getCurrentFile());

      var UndoManager = ace.require("ace/undomanager").UndoManager;
      editor.getSession().setUndoManager(new UndoManager());
    });
  }
}


//function openFolder(folder) {
//  "use strict";
//
//  if (!U.validStr(folder)) {
//    folder = "";
//  }
//
//  $.getJSON('/_open_folder', {
//      folderName: folder
//    },
//    function (data) {
//      if (data.content) {
//        $("#fileTree").html(data.content);
//        setUpFileTree();
//      }
//    });
//}


function getUserDir() {
  "use strict";

  var dir = "";
  $.getJSON('/_user_dir', {
    folderName: ""
  }, function (data) {
    if (data.content.length > 0) {
      dir = data.content;
    }
  });

  console.log(dir);

  return dir;
}


function myFunction() {
  "use strict";

  var folder = prompt("Enter folder location:");

  if (U.validStr(folder)) {
    openFolder(folder);
  }
}