/**
 * Created by tobysuggate on 2/01/14.
 */

"use strict";

var Ide = Ide || {};

Ide.mTable = $('#table');
Ide.mBrowser = $('#browser');
Ide.mEditor = $('#editor');
Ide.mTerminal = $('#terminal');

Ide.setup = function () {
  Ide.hideTerm();
  Ide.hideBrowser();
};


/**
 * @returns {void}
 */
Ide.hideBrowser = function () {
  Ide.mBrowser.detach();
//  Ide.mEditor.width('100%');
};


/**
 * @returns {void}
 */
Ide.hideTerm = function () {
  Ide.mTerminal.detach();
  Ide.mEditor.height('100%');
};


/**
 * @returns {void}
 */
Ide.restoreTerm = function () {
  Ide.mTable.append(Ide.mTerminal);
};

Ide.setup();