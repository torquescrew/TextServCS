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
pane.style = 'width: 100%; height: 100%; position: absolute;';


pane.append = function () {
  pane.body.append('<div id="pane" style="' + pane.style + '"></div>');
};


pane.get = function () {
  return $('#' + pane.id);
};

/**
 * @returns {boolean}
 */
pane.exists = function () {
  return (pane.get().length > 0);
};


pane.remove = function () {
  pane.body.remove('#' + pane.id);
};
