/*global io, serv, u, alert */
/**
 * Created by tobysuggate on 16/01/14.
 */
"use strict";

function Browser() {}


Browser.prototype.mSocket = io.connect('http://localhost');


Browser.prototype.setupBrowser = function () {
  serv.setSocket(this.mSocket);
  this.openFolder("");
};

/**
 * @param {string} folder
 * @returns {void}
 */
Browser.prototype.openFolder = function (folder) {
  var self = this;

  if (!u.validStr(folder)) {
    serv.run('readSetting', ['folder'], function (folder) {
      self.initFileTree(folder);
    });
  }
  else {
    self.initFileTree(folder);
  }
};

/**
 * TODO: should this still be done this way?
 * Ask server to read file and post it to editor
 * @param {string} file
 */
Browser.prototype.requestOpenFile = function (file) {
  if (this.mSocket === null) {
    alert("mSocket is null");
  }

  if (u.validStr(file)) {
    console.log("emit req_open_file: " + file);
    this.mSocket.emit('req_open_file', { fileName: file });
  }
};

/**
 * @param {string} folder
 * @param {function} callback
 */
Browser.prototype.getList = function (folder, callback) {
  serv.run('getListForFolder', [folder], function (list) {
    if (list) {
      callback(list);
    }
  });
};

/**
 * @param {string} folder
 */
Browser.prototype.initFileTree = function (folder) {
  var self = this;

  self.getList(folder, function (list) {
    $('#fileTree').html(list);
    self.setupFileTree();
  });
};

/**
 * @param {jQuery=} root
 */
Browser.prototype.setupFileTree = function (root) {
  var self = this;

  if (!u.defined(root)) {
    root = $('body');
  }

  var file = root.find('.file');
  var folder = root.find(".folder");

  file.mouseover(function () {
    $(this).css("color", "#ffffff");
  });

  file.mouseout(function () {
    $(this).css("color", "#999999");
  });

  file.click(function (evt) {
    evt.stopPropagation();
    self.requestOpenFile($(this).attr("id"));
  });

  folder.mouseover(function () {
    $(this).css("color", "#ffffff");
  });

  folder.mouseout(function () {
    $(this).css("color", "#BBBBBB");
  });

  folder.click(function (evt) {
    evt.stopPropagation();
    var element = this;

    var folder = $(this).attr('id');

    if ($(element).children().length === 0) {
      self.getList(folder, function (list) {
        $(element).append(list).children().hide().slideToggle(100);
        self.setupFileTree($(element));
      });
    }
    else {
      $(element).children("ul").slideToggle(100);
    }
  });
};



