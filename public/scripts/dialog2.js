/**
 * Created by tobysuggate on 15/01/14.
 */
"use strict";

/**
 * @param {string} title
 * @param {string} content
 * @constructor
 */
function Dialog(title, content) {

  var mTitle = title;
  var mHTMLContent = content;
  var mId = u.createId();

  var mHandle = null;
  var mCloser = null;
  var mWindow = null;
  var mContent = null;
  var mGrabberSE = null;

  var mBody = $('body');
  var mMousePos = new Pos(0, 0);
  var mBeginPos = new Pos(0, 0);


  this.setup = function () {
    
  };

  this.open = function () {
    mBody.append(
      '<div class="dialog" id="dialog' + mId + '">'
        + '<div class="deco" id="deco' + mId + '">'
        + '<div class="handle" id="handle' + mId + '"><h3 class="decTitle">' + mTitle + '</h3></div>'
        + '<div class="closer" id="closer' + mId + '"></div>'
        + '</div>'
        + '<div class="content">'
        + mHTMLContent
        + '<div id="grabberSE"></div>'
        + '</div>'
        + '</div>'
    );

    this.setupAccessors();
    this.setup();
    this.centreDialog();
  };

  this.close = function () {
    mWindow.remove();
  };

  this.setupAccessors = function () {
    mHandle = $('#handle' + mId);
    mCloser = $('#closer' + mId);
    mWindow = $('#dialog' + mId);
    mContent = $('.content');
    mGrabberSE = $('#grabberSE');
  };

  this.centreDialog = function () {
    var pageWidth = $(window).width();
    var pageHeight = $(window).height();

    var modW = dlg.window.width() / 2;
    var modH = dlg.window.height() / 2;

    var x = (pageWidth / 2) - modW;
    var y = ((pageHeight / 2) - modH) / 2;

    mWindow.css({ left: x, top: y });
  };

}