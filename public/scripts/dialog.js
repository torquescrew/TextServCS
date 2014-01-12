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

dlg.mousePos = new Pos(0, 0);
dlg.beginPos = new Pos(0, 0);


dlg.setup = function () {
  dlg.setupHandle();

};


dlg.setupHandle = function () {
  dlg.handle.on('mousedown', function (evt) {
    evt.preventDefault(); // prevent text cursor

    pane.append();

    dlg.mousePos = new Pos(evt.clientX, evt.clientY);

    var off = dlg.window.offset();
    dlg.beginPos = new Pos(off.left, off.top);

    pane.get().on('mouseup', function (e) {
      pane.get().off('mouseup');
      pane.get().off('mousemove');
      pane.get().remove();
    });

    pane.get().on('mousemove', function (e) {
      var x = dlg.beginPos.x + (e.clientX - dlg.mousePos.x);
      var y = dlg.beginPos.y + (e.clientY - dlg.mousePos.y);

      dlg.window.css({ left: x, top: y });
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


dlg.setup();
