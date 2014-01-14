/**
 * Created by tobysuggate on 11/01/14.
 */

"use strict";

var dlg = dlg || {};


dlg.handle = null;
dlg.closer = null;
dlg.eventHook = null;
dlg.window = null;
dlg.content = null;
dlg.grabberSE = null;

dlg.body = $('body');
dlg.mousePos = new Pos(0, 0);
dlg.beginPos = new Pos(0, 0);


/** @returns {void} */
dlg.setup = function () {

  dlg.setupAccessors();
  dlg.setupHandle();
  dlg.setupGrabbers();
  dlg.setupCloser();



};

/*
TODO: make allow multiple dialogs to exist at the same time.
 */
dlg.open = function (title) {
  dlg.body.append(
      '<div class="dialog">'
      + '<div class="deco">'
        + '<div class="handle"><h3 class="decTitle">' + title + '</h3></div>'
        + '<div id="closer"></div>'
      + '</div>'
      + '<div class="content">'
        + '<iframe src="../fileBrowser.html" style="width: 100%; height: 100%; overflow: hidden;" seamless></iframe>'
        + '<div id="grabberSE"></div>'
      + '</div>'
    + '</div>'
  );

  dlg.setup();
  dlg.centreDialog();
};


dlg.setupCloser = function () {

  dlg.drawCloser();

  dlg.closer.hover(function () {
    dlg.closer.css({ 'background-color': '#444444' });
    console.log('in');
  }, function () {
    console.log('out');
    dlg.closer.css('background-color', 'inherit');
  });

  dlg.closer.click(function () {
    dlg.close();
  });
};


/** @returns {void} */
dlg.setupAccessors = function () {
  dlg.handle = $('.handle');
  dlg.closer = $('#closer');
  dlg.eventHook = $('#eventHook');
  dlg.window = $('.dialog');
  dlg.content = $('.content');
  dlg.grabberSE = $('#grabberSE');
};


/** @returns {void} */
dlg.close = function () {
  dlg.window.remove();
};


/** @returns {void} */
dlg.centreDialog = function () {
  var pageWidth = $(window).width();
  var pageHeight = $(window).height();

  var modW = dlg.window.width() / 2;
  var modH = dlg.window.height() / 2;

  var x = (pageWidth / 2) - modW;
  var y = ((pageHeight / 2) - modH) / 2;

  dlg.window.css({ left: x, top: y });
};


/** @returns {void} */
dlg.setupHandle = function () {
  dlg.handle.on('mousedown', function (evt) {
    evt.preventDefault(); // prevent text cursor

    var off = dlg.window.offset();
    dlg.savePositions(off.left, off.top, evt);

    pane.createAndGet().on('mousemove', function (e) {
      var change = dlg.getChange(e);

      var x = dlg.beginPos.x + change.x;
      var y = dlg.beginPos.y + change.y;

      dlg.window.css({ left: x, top: y });
    });
  });
};


/**
 * @param {number} x
 * @param {number} y
 * @param {Event} evt
 */
dlg.savePositions = function (x, y, evt) {
  dlg.mousePos = new Pos(evt.clientX, evt.clientY);
  dlg.beginPos = new Pos(x, y);
};


/**
 * @param {Event} evt
 * @returns {Pos}
 */
dlg.getChange = function (evt) {
  var x = (evt.clientX - dlg.mousePos.x);
  var y = (evt.clientY - dlg.mousePos.y);

  return new Pos(x, y);
};


/** @returns {void} */
dlg.setupGrabbers = function () {
  dlg.grabberSE.on('mousedown', function (e) {
    e.preventDefault(); // prevent text cursor

    dlg.savePositions(dlg.content.width(), dlg.content.height(), e);

    pane.createAndGet().on('mousemove', function (e) {
      var change = dlg.getChange(e);

      dlg.window.css({ width: '' + (dlg.beginPos.x + change.x) + 'px' });
      dlg.content.css({ width: '' + (dlg.beginPos.x + change.x) + 'px', height: '' + (dlg.beginPos.y + change.y) + 'px'});
    });
  });
};


dlg.drawCloser = function () {
  dlg.closer.append('<canvas id="closerCanvas" width="100" height="100"></canvas>');

  var context = document.getElementById("closerCanvas").getContext("2d");
  context.lineWidth = 10;
  context.strokeStyle = '#ffffff';

  context.moveTo(30,30);
  context.lineTo(70,70);
  context.stroke();

  context.moveTo(70,30);
  context.lineTo(30,70);
  context.stroke();
};


/**
 * @param {number} x
 * @param {number} y
 * @constructor
 */
function Pos(x, y) {
  this.x = x;
  this.y = y;
}

dlg.open('hello');

