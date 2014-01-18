/*global io, u, alert, s, Bridge */
/**
 * Created by tobysuggate on 16/01/14.
 */
"use strict";

function Browser() {}


//Browser.prototype.mSocket = io.connect('http://localhost');

Browser.prototype.mBridge = new Bridge();

Browser.prototype.setupBrowser = function () {


//  serv.setSocket(this.mBridge.mSocket);
  this.setupSocket();
  this.openFolder("");
};


/** @returns {void} */
Browser.prototype.setupSocket = function () {
  var self = this;

//  this.mSocket.on('news', function () {
//    console.log("this.mSocket.on('news'");
//  });
//
//  console.log(io);
//  io.sockets.send('news');

//  this.mSocket.sockets.send('news', { hello: 'world' });

  this.mBridge.on(s.requestOpenFolder, function (data) {
//    alert('mBridge.on(s.requestOpenFolder,');
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
    this.mBridge.run('readSetting', ['folder'], function (folder) {
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
  if (this.mBridge === null) {
    alert("Browser.mBridge is null");
  }

  if (u.validStr(file)) {
//    this.mBridge.emit(s.requestOpenFile, { fileName: file });
    this.mBridge.toAllClients(s.requestOpenFile, { fileName: file });
  }
};

/**
 * Tell fileBrowser to open given folder
 * @param {string} folder
 */
Browser.prototype.requestOpenFolder = function (folder) {
  if (this.mBridge === null) {
    alert("Browser.mBridge is null");
  }

  if (u.validStr(folder)) {
    this.mBridge.toAllClients(s.requestOpenFolder, { name: folder });
  }
};


/**
 * @param {string} folder
 * @param {function} callback
 */
Browser.prototype.getList = function (folder, callback) {
  this.mBridge.run('getListForFolder', [folder], function (list) {
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



