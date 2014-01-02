/**
 * Created by tobysuggate on 22/12/13.
 */

"use strict";


function setupResizing() {
  document.getElementById('horizontalBar').onmousedown = startHorizontalDrag;
  document.getElementById('verticalBar').onmousedown = startVerticalDrag;
}
setupResizing();


/**
 * @returns {HTMLElement}
 */
function getLeft() {
  return document.getElementById('left');
}

/**
 * @returns {HTMLElement}
 */
function getBottom() {
  return document.getElementById('bottom');
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
  if (enable) {
    $('#frame1').css('pointer-events', 'auto');
    $('#frame2').css('pointer-events', 'auto');
    $('#frame3').css('pointer-events', 'auto');
  }
  else {
    $('#frame1').css('pointer-events', 'none');
    $('#frame2').css('pointer-events', 'none');
    $('#frame3').css('pointer-events', 'none');
  }
}


function startVerticalDrag() {
  enablePointerEvents(false);

  document.body.onmousemove = function (evt) {
    var h = $(document).height() - (evt.clientY + 5);
//    resizeTermHeight(h);
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
//  resizeEditor();
  enablePointerEvents(true);

  document.body.onmousemove = null;
  document.body.onmouseup = null;
}
