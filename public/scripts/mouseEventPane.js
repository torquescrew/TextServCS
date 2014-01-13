/**
 * Created by tobysuggate on 12/01/14.
 */
"use strict";

var pane = pane || {};

/** @type {jQuery} */
pane.body = $('body');

/** @type {string} */
pane.id = 'pane';

/**
 * We don't use a style sheet to reduce dependencies.
 * @type {string}
 */
pane.style = 'width: 100%; height: 100%; position: absolute; z-index: 300;';

/**
 * @returns {pane}
 */
pane.append = function () {
  pane.body.append('<div id="pane" style="' + pane.style + '"></div>');

  return pane;
};

/**
 * @returns {jQuery}
 */
pane.get = function () {
  return $('#' + pane.id);
};

/**
 * @returns {boolean}
 */
pane.exists = function () {
  return (pane.get().length > 0);
};

/**
 * @returns {jQuery}
 */
pane.createAndGet = function () {
  var p = pane.append().get();

  p.on('mouseup', function () {
    p.off('mouseup');
    p.off('mousemove');
    p.remove();
  });

  return p;
};
