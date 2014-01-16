/*global Browser, alert, u, serv */
/**
 * Created by tobysuggate on 16/01/14.
 */
"use strict";

var FindType = Object.freeze({
  "folder": 0,
  "file": 1
});


/**
 * @constructor
 */
function Finder () {}


/** @extends {Browser} */
Finder.prototype = new Browser();

/** @type {FindType} */
Finder.prototype.mType = FindType.folder;

/** @type {jQuery} */
Finder.prototype.mSelected = null;


Finder.prototype.setType = function (type) {
  this.mType = type;
};


Finder.prototype.getType = function () {
  return this.mType;
};


Finder.prototype.close = function () {
  window.top.postMessage('closeDialog', '*');
};


Finder.prototype.openFolder = function (folder) {
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

    if (self.getType() === FindType.file) {
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

    if (self.mType === FindType.folder) {
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


