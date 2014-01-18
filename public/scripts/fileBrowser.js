/*global io, u, alert, s, Bridge */
/**
 * Created by tobysuggate on 16/01/14.
 */
"use strict";

var bridge = new Bridge();

function Browser() {}

Browser.prototype.setupBrowser = function () {
  this.setupSocket();
  this.openFolder("");
};

/** @returns {void} */
Browser.prototype.setupSocket = function () {
  var self = this;

  bridge.on(s.requestOpenFolder, function (data) {
    self.openFolder(data.name);
  });
};

/**
 * @param {string} folder
 * @returns {void}
 */
Browser.prototype.openFolder = function (folder) {
  var self = this;

  if (!u.validStr(folder)) {
    bridge.run('readSetting', ['folder'], function (folder) {
      self.initFileTree(folder);
    });
  }
  else {
    self.initFileTree(folder);
  }
};

/**
 * Tell editor to open given file
 * @param {string} file
 */
Browser.prototype.requestOpenFile = function (file) {
  if (bridge === null) {
    alert("Browser.mBridge is null");
  }

  if (u.validStr(file)) {
    bridge.toAllClients(s.requestOpenFile, { fileName: file });
  }
};

/**
 * Tell fileBrowser to open given folder
 * @param {string} folder
 */
Browser.prototype.requestOpenFolder = function (folder) {
  if (bridge === null) {
    alert("Browser.mBridge is null");
  }

  if (u.validStr(folder)) {
    bridge.toAllClients(s.requestOpenFolder, { name: folder });
  }
};


/**
 * @param {string} folder
 * @param {function} callback
 */
Browser.prototype.getList = function (folder, callback) {
  bridge.run('getListForFolder', [folder], function (list) {
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



