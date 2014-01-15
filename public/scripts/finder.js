/*global Browser, alert, u, serv */
/**
 * Created by tobysuggate on 16/01/14.
 */
"use strict";

function Finder () {}

Finder.prototype = new Browser();

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