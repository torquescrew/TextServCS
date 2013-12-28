
var App = App || {};
App.socket = io.connect('http://localhost');

$( document ).ready(function() {
  "use strict";



  App.socket.on('news', function(data) {
    console.log('fileBrowser on news ' + data);
    App.socket.emit('my other event', { my: 'data' });
  });

  openFolder("");
});


function openFolder(folder) {
  "use strict";

  if (!U.validStr(folder)) {
    folder = "";
  }

  $.getJSON('/_open_folder', {
      folderName: folder
    },
    function (data) {
      if (data.content) {
        $("#fileTree").html(data.content);
        App.setUpFileTree();
      }
    });
}


/**
 * Ask server to read file and post it to editor
 * @param {string} file
 */
App.requestOpenFile = function(file) {
  "use strict";

  if (validStr(file)) {
    console.log("emit req_open_file: " + file);
    App.socket.emit('req_open_file', { fileName: file });
  }

};


App.setUpFileTree = function() {
  "use strict";

  var folder = $(".folder");
  folder.mouseover(function() {
    $(this).css("color", "#ffffff");
  });

  folder.mouseout(function() {
    $(this).css("color", "#BBBBBB");
  });

  var file = $(".file");
  file.mouseover(function() {
    $(this).css("color", "#ffffff");
  });

  file.mouseout(function() {
    $(this).css("color", "#999999");
  });
  $(".folder ul").hide();

  folder.click(function(evt) {
    evt.stopPropagation();
    $(this).children("ul").slideToggle(100);
  });

  file.click(function(evt) {
    evt.stopPropagation();
    App.requestOpenFile($(this).attr("id"));
  });

  $(".myButton").hover((function() {
    $(this).css("color", "#ffffff");
    $(this).css("background-color", "#111111");
  }), function() {
    $(this).css("color", "#bbbbbb");
    $(this).css("background", "none");
  });
};
