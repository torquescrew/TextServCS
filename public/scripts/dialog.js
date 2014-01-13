/**
 * Created by tobysuggate on 11/01/14.
 */

"use strict";

var dlg = dlg || {};

dlg.handle = $('.handle');
dlg.closer = $('#closer');
dlg.eventHook = $('#eventHook');
dlg.body = $('body');
dlg.window = $('.dialog');
dlg.content = $('.content');

dlg.grabberSE = $('#grabberSE');

dlg.mousePos = new Pos(0, 0);
dlg.beginPos = new Pos(0, 0);


/** @returns {void} */
dlg.setup = function () {
  dlg.setupHandle();
  dlg.setupGrabbers();

  dlg.closer.click(function () {
    dlg.close();
  });
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
        + '<iframe src="fileBrowser.html" style="width: 100%; height: 100%; overflow: hidden;" seamless></iframe>'
        + '<div id="grabberSE"></div>'
      + '</div>'
    + '</div>'
  );

  dlg.handle = $('.handle');
  dlg.closer = $('#closer');
  dlg.eventHook = $('#eventHook');
  dlg.body = $('body');
  dlg.window = $('.dialog');
  dlg.content = $('.content');

  dlg.grabberSE = $('#grabberSE');

  dlg.setup();

  dlg.centreDialog();
};


dlg.close = function () {
  dlg.window.remove();
};


dlg.centreDialog = function () {
  var pageWidth = $(window).width();
  var pageHeight = $(window).height();

  var modW = dlg.window.width() / 2;
  var modH = dlg.window.height() / 2;

  var x = (pageWidth / 2) - modW;
  var y = ((pageHeight / 2) - modH) / 2;

  console.log(pageHeight);
  console.log(modH);

  dlg.window.css({ left: x, top: y });
};





/** @returns {void} */
dlg.setupHandle = function () {
  dlg.handle.on('mousedown', function (evt) {
    evt.preventDefault(); // prevent text cursor

    var off = dlg.window.offset();
    dlg.savePositions(off.left, off.top, evt);

    var p = pane.createAndGet();

    p.on('mousemove', function (e) {
      var change = dlg.getChange(e);

      var x = dlg.beginPos.x + change.x;
      var y = dlg.beginPos.y + change.y;

      dlg.window.css({ left: x, top: y });
    });
  });

//  dlg.closer.unbind();
};


/**
 *
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

    var p = pane.createAndGet();

    dlg.savePositions(dlg.content.width(), dlg.content.height(), e);

    p.on('mousemove', function (e) {
      var change = dlg.getChange(e);

      dlg.window.css({ width: '' + (dlg.beginPos.x + change.x) + 'px' });
      dlg.content.css({ width: '' + (dlg.beginPos.x + change.x) + 'px', height: '' + (dlg.beginPos.y + change.y) + 'px'});
    });

  });
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
//dlg.setup();
