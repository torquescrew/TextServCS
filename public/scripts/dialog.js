/*global u: flase, pane: false */
/**
 * Created by tobysuggate on 15/01/14.
 */


"use strict";

/**
 * @param {number} x
 * @param {number} y
 * @constructor
 */
function Pos(x, y) {
  this.x = x;
  this.y = y;
}


/**
 * @param {string} title
 * @param {string} content
 * @constructor
 */
function Dialog(title, content) {

  var self = this;
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

  self.open = function () {
    mBody.append(
      '<div class="dialog" id="dialog' + mId + '">' +
        '<div class="deco" id="deco' + mId + '">' +
          '<div class="handle" id="handle' + mId + '"><h3 class="decTitle">' + mTitle + '</h3></div>' +
          '<div class="closer" id="closer' + mId + '"></div>' +
        '</div>' +
        '<div class="content" id="content' + mId + '">' +
          mHTMLContent +
          '<div class="grabberSE" id="grabberSE' + mId + '"></div>' +
        '</div>' +
      '</div>'
    );

    self.setupAccessors();
    self.setupHandle();
    self.setupGrabbers();
    self.setupCloser();
    self.centreDialog();
  };

  self.close = function () {
    mWindow.remove();
  };

  self.setupAccessors = function () {
    mHandle = $('#handle' + mId);
    mCloser = $('#closer' + mId);
    mWindow = $('#dialog' + mId);
    mContent = $('#content' + mId);
    mGrabberSE = $('#grabberSE' + mId);
  };

  self.centreDialog = function () {
    var pageWidth = $(window).width();
    var pageHeight = $(window).height();

    var modW = mWindow.width() / 2;
    var modH = mWindow.height() / 2;

    var x = (pageWidth / 2) - modW;
    var y = ((pageHeight / 2) - modH) / 2;

    mWindow.css({ left: x, top: y });
  };

  self.setupHandle = function () {
    mHandle.on('mousedown', function (evt) {
      evt.preventDefault(); // prevent text cursor

      var off = mWindow.offset();
      self.savePositions(off.left, off.top, evt);

      pane.createAndGet().on('mousemove', function (e) {
        var change = self.getChange(e);

        var x = mBeginPos.x + change.x;
        var y = mBeginPos.y + change.y;

        mWindow.css({ left: x, top: y });
      });
    });
  };

  /**
   * @param {number} x
   * @param {number} y
   * @param {Event} evt
   */
  self.savePositions = function (x, y, evt) {
    mMousePos = new Pos(evt.clientX, evt.clientY);
    mBeginPos = new Pos(x, y);
  };

  /**
   * @param {Event} evt
   * @returns {Pos}
   */
  self.getChange = function (evt) {
    var x = (evt.clientX - mMousePos.x);
    var y = (evt.clientY - mMousePos.y);

    return new Pos(x, y);
  };

  /** @returns {void} */
  self.drawCloser = function () {
    mCloser.append('<canvas class="closerCanvas" id="closerCanvas' + mId + '" width="100" height="100"></canvas>');

    var context = document.getElementById("closerCanvas" + mId).getContext("2d");
    context.lineWidth = 10;
    context.strokeStyle = '#ffffff';

    context.moveTo(30,30);
    context.lineTo(70,70);
    context.stroke();

    context.moveTo(70,30);
    context.lineTo(30,70);
    context.stroke();
  };

  /** @returns {void} */
  self.setupCloser = function () {
    self.drawCloser();

    mCloser.hover(function () {
      mCloser.css({ 'background-color': '#444444' });
    }, function () {
      mCloser.css('background-color', 'inherit');
    });

    mCloser.click(function () {
      self.close();
    });
  };

  /** @returns {void} */
  self.setupGrabbers = function () {
    mGrabberSE.on('mousedown', function (e) {
      e.preventDefault(); // prevent text cursor

      self.savePositions(mContent.width(), mContent.height(), e);

      pane.createAndGet().on('mousemove', function (e) {
        var change = self.getChange(e);

        mWindow.css({ width: '' + (mBeginPos.x + change.x) + 'px' });
        mContent.css({ width: '' + (mBeginPos.x + change.x) + 'px', height: '' + (mBeginPos.y + change.y) + 'px'});
      });
    });
  };
}