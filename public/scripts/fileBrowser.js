"use strict";

var browser = browser || {};

browser.socket = io.connect('http://localhost');

browser.setup = function () {
  browser.socket.on('news', function(data) {
    console.log('fileBrowser on news ' + data);
    browser.socket.emit('my other event', { my: 'data' });
  });

  browser.openFolder("");
};

/**
 * @param {string} folder
 * @returns {void}
 */
browser.openFolder = function (folder) {
  if (!u.validStr(folder)) {
    folder = "";
  }

  $.getJSON('/_open_folder', {
      folderName: folder
    },
    function (data) {
      if (data.content) {
        $("#fileTree").html(data.content);
        browser.setUpFileTree();
      }
    });
};

/**
 * Ask server to read file and post it to editor
 * @param {string} file
 */
browser.requestOpenFile = function(file) {
  if (browser.socket === null) {
    alert("browser.socket is null");
  }

  if (u.validStr(file)) {
    console.log("emit req_open_file: " + file);
    browser.socket.emit('req_open_file', { fileName: file });
  }
};

/**
 * @returns {void}
 */
browser.setUpFileTree = function() {
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
    browser.requestOpenFile($(this).attr("id"));
  });

  $(".myButton").hover((function() {
    $(this).css("color", "#ffffff");
    $(this).css("background-color", "#111111");
  }), function() {
    $(this).css("color", "#bbbbbb");
    $(this).css("background", "none");
  });
};

browser.setup();
