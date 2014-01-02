/**
 * Created by tobysuggate on 22/12/13.
 */

"use strict";

/**
 * @returns {void}
 */
function setupResizing() {
  document.getElementById('horizontalBar').onmousedown = startHorizontalDrag;
  document.getElementById('verticalBar').onmousedown = startVerticalDrag;
}
setupResizing();

/**
 * @returns {HTMLElement}
 */
function getLeft() {
  return document.getElementById('browser');
}

/**
 * TODO: refactor
 * @returns {HTMLElement}
 */
function getBottom() {
  return document.getElementById('terminal');
}

/**
 * @returns {void}
 */
function startHorizontalDrag() {
  enablePointerEvents(false);

  document.body.onmousemove = function (evt) {
    var w = evt.clientX;
//    resizeTermWidth($(document).width() - w);
    getLeft().setAttribute("style", "width:" + w + "px");
  };

  document.body.onmouseup = function () {
    onStopDrag();
  };
}

/**
 * @param {boolean} enable
 */
function enablePointerEvents(enable) {
//  $('#frame1').css('pointer-events', enable? 'auto':'none');
//  $('#frame2').css('pointer-events', enable? 'auto':'none');
//  $('#frame3').css('pointer-events', enable? 'auto':'none');
  $('iframe').css('pointer-events', enable? 'auto':'none');
}

/**
 * @returns {void}
 */
function startVerticalDrag() {
  enablePointerEvents(false);

  document.body.onmousemove = function (evt) {
    var h = $(document).height() - (evt.clientY + 5);
    getBottom().setAttribute("style", "height:" + h + "px");
  };

  document.body.onmouseup = function () {
    onStopDrag();
  };
}

/**
 * @returns {void}
 */
function onStopDrag() {
  enablePointerEvents(true);
  document.body.onmousemove = null;
  document.body.onmouseup = null;
}
