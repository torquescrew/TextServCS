/**
 * Created by tobysuggate on 22/12/13.
 */

"use strict";

var resizer = resizer || {};

/**
 * @returns {void}
 */
resizer.setup = function () {
  document.getElementById('verticalBar').onmousedown = resizer.startHorizontalDrag;
  document.getElementById('horizontalBar').onmousedown = resizer.startVerticalDrag;
};

/**
 * @returns {HTMLElement}
 */
resizer.getLeft = function () {
  return document.getElementById('browser');
};

/**
 * @returns {HTMLElement}
 */
resizer.getBottom = function () {
  return document.getElementById('terminal');
};

/**
 * @returns {void}
 */
resizer.startHorizontalDrag = function () {
  resizer.enablePointerEvents(false);

  document.body.onmousemove = function (evt) {
    var w = evt.clientX;
    resizer.getLeft().setAttribute("style", "width:" + w + "px");
  };

  document.body.onmouseup = function () {
    resizer.onStopDrag();
  };
};

/**
 * @param {boolean} enable
 */
resizer.enablePointerEvents = function (enable) {
  $('iframe').css('pointer-events', enable? 'auto':'none');
};

/**
 * @returns {void}
 */
resizer.startVerticalDrag = function () {
  resizer.enablePointerEvents(false);

  document.body.onmousemove = function (evt) {
    var h = $(document).height() - (evt.clientY + 5);
    resizer.getBottom().setAttribute("style", "height:" + h + "px");
  };

  document.body.onmouseup = function () {
    resizer.onStopDrag();
  };
};

/**
 * @returns {void}
 */
resizer.onStopDrag = function () {
  resizer.enablePointerEvents(true);
  document.body.onmousemove = null;
  document.body.onmouseup = null;
};

resizer.setup();