"use strict";

var browser = browser || {};

browser.socket = io.connect('http://localhost');

browser.setup = function () {
  browser.socket.on('news', function(data) {
    console.log('fileBrowser on news ' + data);
    browser.socket.emit('my other event', { my: 'data' });
  });

  serv.setSocket(browser.socket);

  browser.openFolder("");
};

/**
 * @param {string} folder
 * @returns {void}
 */
browser.openFolder = function (folder) {
  if (!u.validStr(folder)) {
    serv.run('readSetting', ['folder'], function (folder) {
      browser.initFileTree(folder);
    });
  }
  else {
    browser.initFileTree(folder);
  }
};


/**
 * @param {string} folder
 * @param {function} callback
 */
browser.getList = function (folder, callback) {
  serv.run('getListForFolder', [folder], function (list) {
    if (list) {
      callback(list);
    }
  });
};


/**
 * @param {string} folder
 */
browser.initFileTree = function (folder) {
  browser.getList(folder, function (list) {
    $('#fileTree').html(list);
    browser.setUpFileTree();
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
browser.setUpFileTree = function(root) {
  if (!u.defined(root)) {
    root = $('body');
  }

  var file = root.find('.file');
  var folder = root.find(".folder");

  file.mouseover(function() {
    $(this).css("color", "#ffffff");
  });

  file.mouseout(function() {
    $(this).css("color", "#999999");
  });

  file.click(function(evt) {
    evt.stopPropagation();
    browser.requestOpenFile($(this).attr("id"));
  });

  folder.mouseover(function() {
    $(this).css("color", "#ffffff");
  });

  folder.mouseout(function() {
    $(this).css("color", "#BBBBBB");
  });

  folder.click(function(evt) {
    evt.stopPropagation();
    var self = this;

    var folder = $(this).attr('id');

    if ($(self).children().length == 0) {
      browser.getList(folder, function (list) {
        $(self).append(list).children().hide().slideToggle(100);
        browser.setUpFileTree($(self));
      });
    }
    else {
      $(self).children("ul").slideToggle(100);
    }
  });

};

browser.setup();
