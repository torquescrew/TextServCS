/**
 * Created by tobysuggate on 2/01/14.
 */

"use strict";

var Ide = Ide || {};

Ide.mTable = $('#table');
Ide.mHasBrowser = true;
Ide.mBrowser = $('#browser');
Ide.mEditor = $('#editor');
Ide.mTerminal = $('#terminal');
Ide.mHasTerminal = true;
Ide.mVerticalBar = $('#verticalBar');
Ide.mHorizontalBar = $('#horizontalBar');

Ide.mRow2 = $('#row2');
Ide.mRow3 = $('#row3');
Ide.mRow4 = $('#row4');

Ide.mToggleTermButton = $('#toggleTerminal');
Ide.mToggleBrowser = $('#toggleBrowser');

Ide.setup = function () {
  Ide.setupButtons();
};


Ide.setupButtons = function () {
  Ide.mToggleTermButton.click(function () {
    if (Ide.mHasTerminal) {
      Ide.hideTerm();
    }
    else {
      Ide.restoreTerm();
    }
    Ide.mHasTerminal = !Ide.mHasTerminal;
  });

  Ide.mToggleBrowser.click(function  () {
    if (Ide.mHasBrowser) {
      Ide.hideBrowser();
    }
    else {
      Ide.restoreBrowser();
    }
    Ide.mHasBrowser = !Ide.mHasBrowser;
  });
};


Ide.hideBrowser = function () {
  Ide.mVerticalBar.detach();
  Ide.mBrowser.detach();
};


Ide.restoreBrowser = function () {
  Ide.mRow2.prepend(Ide.mVerticalBar);
  Ide.mRow2.prepend(Ide.mBrowser);
};


Ide.hideTerm = function () {
  Ide.mTerminal.detach();
  Ide.mHorizontalBar.detach();
  Ide.mEditor.height('100%');
};


Ide.restoreTerm = function () {
  Ide.mRow3.append(Ide.mHorizontalBar);
  Ide.mRow4.append(Ide.mTerminal);
};

Ide.setup();