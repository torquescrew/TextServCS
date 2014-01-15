/*global ide: false, Dialog: false */
/**
 * Created by tobysuggate on 8/01/14.
 */

"use strict";

var menu = menu || {};

menu.fileMenu = $('#file-menu');
menu.menus = [];
menu.items = $('.item-row');
menu.backgroundColor = menu.fileMenu.css('background-color');


menu.setup = function () {

  menu.menus.push(new MenuState('file-button', 'file-menu', menu.menus));
  menu.menus.push(new MenuState('view-button', 'view-menu', menu.menus));
//  menu.menus.push(new MenuState('openRecent', 'recentsMenu', menu.menus, true));

  menu.items.mouseover(function () {
    $(this).css("background-color", "#222222");
  });

  menu.items.mouseout(function () {
    $(this).css("background-color", menu.backgroundColor);
  });

  menu.hookupItems();

  var openFileDlg = new Dialog('new dialog', '<iframe src="../finder.html" style="width: 100%; height: 100%; overflow: hidden;" seamless></iframe>');
  openFileDlg.open();
};


menu.hookupItems = function () {

  $('#openFile').click(function () {
    var openFileDlg = new Dialog('new dialog', '<iframe src="../finder.html" style="width: 100%; height: 100%; overflow: hidden;" seamless></iframe>');
    openFileDlg.open();

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

//  $('#openRecent').mouseover(function () {
//
//  });
};

menu.closeAll = function () {
  menu.menus.forEach(function (m) {
    m.close();
  });
};


/**
 * @param {string} buttonId
 * @param {string} menuId
 * @param {Array.<MenuState>} others
 * @param {bool=} isSubMenu
 * @constructor
 */
function MenuState(buttonId, menuId, others, isSubMenu) {
  var self = this;

  self.mButtonId = buttonId;
  self.mMenuId = menuId;
  self.mIsOpen = false;
  self.mOthers = others;
  self.mButton = $(('#' + self.mButtonId));
  self.mMenu = $(('#' + self.mMenuId));
  self.mIsSub = isSubMenu || false;

  setupToggle();

  function setupToggle() {
    self.mButton.click(function () {
      var pos = $(this).offset();
      pos.top += $(this).outerHeight(true);

      if (self.mIsSub) {
        pos.left += $(self.mMenuId).width();
      }

      self.mMenu.css({ top: pos.top, left: pos.left });
      self.mMenu.toggleClass('show');
      self.mButton.toggleClass('darken');

      self.mIsOpen = !self.mIsOpen;

      if (self.mIsOpen) {
        enableMouseover();
      }
      else {
        disableMouseover();
      }
    });
  }

//  function setupSubMenus() {
//    self.mSubMenus.forEach(function (sub) {
//
//    });
//  }

  function enableMouseover() {
    self.mOthers.forEach(function (o) {
      o.mButton.mouseover(function () {
        if (!o.mIsSub) {
          self.closeOthers();
        }
        o.open();
      });
    });
  }


  function disableMouseover() {
    self.mOthers.forEach(function (o) {
      o.mButton.unbind('mouseover');
    });
  }

  self.closeOthers = function () {
    self.mOthers.forEach(function (o) {
      o.close();
    });
  };


  self.close = function () {
    if (self.mIsOpen) {
      self.mButton.click();
      self.mIsOpen = false;
      disableMouseover();
    }
  };

  self.open = function () {
    if (!self.mIsOpen) {
      self.mButton.click();
      self.mIsOpen = true;
      enableMouseover();
    }
  };
}


menu.setup();