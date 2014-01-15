/**
 * Created by tobysuggate on 11/01/14.
 */

"use strict";

var dlg = dlg || {};


dlg.handle = null;
dlg.closer = null;
dlg.window = null;
dlg.content = null;
dlg.grabberSE = null;

dlg.body = $('body');
dlg.mousePos = new Pos(0, 0);
dlg.beginPos = new Pos(0, 0);


/** @returns {void} */
dlg.setup = function () {

  dlg.setupHandle();
  dlg.setupGrabbers();
  dlg.setupCloser();
};


dlg.open = function (title, content) {
  var id = u.createId();

  dlg.body.append(
      '<div class="dialog" id="dialog' + id + '">'
      + '<div class="deco" id="deco' + id + '">'
        + '<div class="handle" id="handle' + id + '"><h3 class="decTitle">' + title + '</h3></div>'
        + '<div class="closer" id="closer' + id + '"></div>'
      + '</div>'
      + '<div class="content">'
        + content
        + '<div id="grabberSE"></div>'
      + '</div>'
    + '</div>'
  );

  dlg.setupAccessors(id);

  dlg.setup();
  dlg.centreDialog();
};


/**
 * @param {string} id
 */
dlg.setupAccessors = function (id) {
  dlg.handle = $('#handle' + id);
  dlg.closer = $('#closer' + id);
  dlg.window = $('#dialog' + id);
  dlg.content = $('.content');
  dlg.grabberSE = $('#grabberSE');
};


dlg.setupCloser = function () {

  dlg.drawCloser();

  dlg.closer.hover(function () {
    dlg.closer.css({ 'background-color': '#444444' });
  }, function () {
    dlg.closer.css('background-color', 'inherit');
  });

  dlg.closer.click(function () {
    dlg.close();
  });
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

//dlg.open('hello');

