/*global ide, Dialog, alert, s, MenuState */
/**
 * Created by tobysuggate on 8/01/14.
 */

"use strict";

var menu = menu || {};

//menu.fileMenu = $('#file-menu');
menu.menus = [];
//menu.items = $('.item-row');
//menu.backgroundColor = menu.fileMenu.css('background-color');


menu.setup = function () {

  var fileMenu = new MenuState();
  fileMenu.setup('file-button', 'file-menu', menu.menus);
  menu.menus.push(fileMenu);

  var viewMenu = new MenuState();
  viewMenu.setup('view-button', 'view-menu', menu.menus);
  menu.menus.push(viewMenu);

  var recentFileMenu = new MenuState();
  recentFileMenu.setup('openRecent', 'recentMenu', menu.menus, fileMenu);
  menu.menus.push(recentFileMenu);

//  menu.menus.push(new MenuState('openRecent', 'recentMenu', menu.menus, true));

//  menu.items.mouseover(function () {
//    $(this).css("background-color", "#222222");
//  });
//
//  menu.items.mouseout(function () {
//    $(this).css("background-color", menu.backgroundColor);
//  });

  menu.hookupItems();
};


menu.setupRecents = function () {
  $('#openRecent').mouseover(function () {

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


menu.hookupItems = function () {

  $('#openFile').click(function () {
    menu.openFinder(s.file, 'Open File');
    menu.closeAll();
  });

  $('#openFolder').click(function () {
    menu.openFinder(s.folder, 'Open Folder');
    menu.closeAll();
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


menu.closeAll = function () {
  menu.menus.forEach(function (m) {
    m.close();
  });
};


menu.setup();
