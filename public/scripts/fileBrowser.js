
var Browser = Browser || {};
//Browser.socket = null;
Browser.socket = io.connect('http://localhost');

//(function() {
//  "use strict";

//  Browser.socket = io.connect('http://localhost');

  Browser.socket.on('news', function(data) {
    console.log('fileBrowser on news ' + data);
    Browser.socket.emit('my other event', { my: 'data' });
  });

  openFolder("");

//})();


/**
 * @param {string} folder
 * @returns {void}
 */
function openFolder(folder) {
  "use strict";

  if (!u.validStr(folder)) {
    folder = "";
  }

  $.getJSON('/_open_folder', {
      folderName: folder
    },
    function (data) {
      if (data.content) {
        $("#fileTree").html(data.content);
        Browser.setUpFileTree();
      }
    });
}


/**
 * Ask server to read file and post it to editor
 * @param {string} file
 */
Browser.requestOpenFile = function(file) {
  "use strict";


  if (Browser.socket === null) {
    alert("Browser.socket is null");
  }

  if (u.validStr(file)) {
    console.log("emit req_open_file: " + file);
    Browser.socket.emit('req_open_file', { fileName: file });
  }

};


/**
 * @returns {void}
 */
Browser.setUpFileTree = function() {
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
    Browser.requestOpenFile($(this).attr("id"));
  });

  $(".myButton").hover((function() {
    $(this).css("color", "#ffffff");
    $(this).css("background-color", "#111111");
  }), function() {
    $(this).css("color", "#bbbbbb");
    $(this).css("background", "none");
  });
};
