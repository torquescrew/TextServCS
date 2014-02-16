/*global ide, Dialog, alert, s, MenuState */
/**
 * Created by tobysuggate on 8/01/14.
 */

"use strict";

var menu = menu || {};

menu.fileMenu = $('#fileMenu');
menu.viewMenu = $('#viewMenu');


menu.setup = function () {
  menu.hookupFileMenu();
  menu.hookupViewMenu();
};


menu.hookupFileMenu = function () {
  var fileButton = $('#file-button');

  fileButton.click(function () {
    var pos = fileButton.offset();
    pos.top += fileButton.outerHeight(true);

    menu.fileMenu.css({ top: pos.top, left: pos.left });
    menu.fileMenu.toggleClass('show');
  });

  $('#openFile').click(function () {
    menu.openFinder(s.file, 'Open File');
    menu.closeAll();
  });

  $('#openFolder').click(function () {
    menu.openFinder(s.folder, 'Open Folder');
    menu.closeAll();
  });
};

menu.hookupViewMenu = function () {
  var viewButton = $('#view-button');

  viewButton.click(function () {
    var pos = viewButton.offset();
    pos.top += viewButton.outerHeight(true);

    menu.viewMenu.css({ top: pos.top, left: pos.left });
    menu.viewMenu.toggleClass('show');
  });


  $('#toggleTerminal').click(function () {
    ide.toggleTerminal();
    menu.closeAll();
  });

  $('#toggleFileBrowser').click(function () {
    ide.toggleFileBrowser();
    menu.closeAll();
  });
};


/**
 * @param {string} findType
 * @param {string} title
 */
menu.openFinder = function (findType, title) {
  var style = 'height = 20rem; width = 100%;';
  var openFileDlg = new Dialog(title, '<iframe id="dialog2" src="../finder.html" style="' + style + '" seamless></iframe>');
  openFileDlg.open();

  var win = document.getElementById('dialog2').contentWindow;

  win.onload = function () {
    win.postMessage(findType, '*');
  };

  window.onmessage = function (e) {
    if (e.data === 'closeDialog') {
      openFileDlg.close();
    }
  };
};

menu.closeAll = function () {
  menu.fileMenu.removeClass('show');
  menu.viewMenu.removeClass('show');
};


menu.setup();
