/**
 * Created by tobysuggate on 2/01/14.
 */

"use strict";

var ide = ide || {};

ide.mSocket = io.connect('http://localhost');

ide.mTable = $('#table');
ide.mHasBrowser = true;
ide.mBrowser = $('#browser');
ide.mEditor = $('#editor');
ide.mTerminal = $('#terminal');
ide.mHasTerminal = true;
ide.mVerticalBar = $('#verticalBar');
ide.mHorizontalBar = $('#horizontalBar');

ide.mRow2 = $('#row2');
ide.mRow3 = $('#row3');
ide.mRow4 = $('#row4');

ide.mToggleTermButton = $('#toggleTerminal');
ide.mToggleBrowser = $('#toggleBrowser');

ide.setup = function () {
  serv.setSocket(ide.mSocket);

  serv.run('readSetting', ['browser_open'], function (open) {
    if (!open) {
//      ide.hideBrowser();
    }
  });

  serv.run('readSetting', ['terminal_open'], function (open) {
    if (!open) {
//      ide.hideTerm();
    }
  });

};


ide.toggleFileBrowser = function () {
  if (ide.mHasBrowser) {
    ide.hideBrowser();
  }
  else {
    ide.restoreBrowser();
  }
  ide.mHasBrowser = !ide.mHasBrowser;
};

ide.toggleTerminal = function () {
  if (ide.mHasTerminal) {
    ide.hideTerm();
  }
  else {
    ide.restoreTerm();
  }
  ide.mHasTerminal = !ide.mHasTerminal;
};


ide.hideBrowser = function () {
  ide.mVerticalBar.detach();
  ide.mBrowser.detach();

  serv.run('writeSetting', ['browser_open', false]);
};


ide.restoreBrowser = function () {
  ide.mRow2.prepend(ide.mVerticalBar);
  ide.mRow2.prepend(ide.mBrowser);

  serv.run('writeSetting', ['browser_open', true]);
};


ide.hideTerm = function () {
  ide.mTerminal.detach();
  ide.mHorizontalBar.detach();
  ide.mEditor.height('100%');

  serv.run('writeSetting', ['terminal_open', false]);
};


ide.restoreTerm = function () {
  ide.mRow3.append(ide.mHorizontalBar);
  ide.mRow4.append(ide.mTerminal);

  serv.run('writeSetting', ['terminal_open', true]);
};

ide.setup();

