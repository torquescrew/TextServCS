/*global Browser, alert, u, s */
/**
 * Created by tobysuggate on 16/01/14.
 */
"use strict";


/**
 * @constructor
 */
function Finder () {}


/** @extends {Browser} */
Finder.prototype = new Browser();

/** @type {string} */
Finder.prototype.mType = s.folder;

/** @type {jQuery} */
Finder.prototype.mSelected = null;


Finder.prototype.setupFinder = function () {
  var self = this;

//  serv.setSocket(this.mSocket);
  this.openFolder();

  window.onmessage = function (e) {
    if (e.data === s.file) {
      self.setType(s.file);
    }
    else if (e.data === s.folder) {
      self.setType(s.folder);
    }
  };
};


/**
 * @param {function (string)} callback
 */
Finder.prototype.getHomeFolder = function (callback) {
//  var self = this;

  this.mBridge.run('getHomeFolder', [], callback);
};


Finder.prototype.setType = function (type) {
  this.mType = type;
};


Finder.prototype.getType = function () {
  return this.mType;
};


Finder.prototype.close = function () {
  window.top.postMessage('closeDialog', '*');
};


Finder.prototype.openFolder = function () {
  var self = this;

  this.mBridge.run('getHomeFolder', [], function (folder) {
    self.initFileTree(folder);
  });

};

/** @returns {string} */
Finder.prototype.getSelectedId = function () {
  return this.mSelected.attr('id');
};

/** @returns {void} */
Finder.prototype.setSelected = function (elem) {
  if (this.mSelected !== null) {
    this.mSelected.css('background-color', 'inherit');
  }
  this.mSelected = $(elem);
  this.mSelected.css('background-color', '#ff4444');
};


/**
 * @param {jQuery=} root
 */
Finder.prototype.setupFileTree = function (root) {
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

    if (self.getType() === s.file) {
      self.setSelected(this);
    }
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

    if (self.mType === s.folder) {
      self.setSelected(this);
    }

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
