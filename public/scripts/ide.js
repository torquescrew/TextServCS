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
  ide.setupButtons();

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


//  ide.setupMenu();
};




//ide.setupMenu = function () {
//  $('#file-button').click(function () {
////    alert("file-menu");
//
//    $('#file-menu').css('visibility', 'visible');
//
//
//  });
//
//  ide.openMenu();
//};
//
//
//ide.openMenu = function () {
////  $(function() {
////    $( "#menu" ).menu({ position: { my: "left top", at: "right-5 top+5" } });
////  });
//};


ide.setupButtons = function () {
  ide.mToggleTermButton.click(function () {
    if (ide.mHasTerminal) {
      ide.hideTerm();
    }
    else {
      ide.restoreTerm();
    }
    ide.mHasTerminal = !ide.mHasTerminal;
  });

  ide.mToggleBrowser.click(function  () {
    if (ide.mHasBrowser) {
      ide.hideBrowser();
    }
    else {
      ide.restoreBrowser();
    }
    ide.mHasBrowser = !ide.mHasBrowser;
  });
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

