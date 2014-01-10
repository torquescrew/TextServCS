/**
 * Created by tobysuggate on 8/01/14.
 */

"use strict";

var menu = menu || {};

menu.fileMenu = $('#file-menu');
menu.fileButton = $('#file-button');

menu.viewButton = $('#view-button');
menu.viewMenu = $('#view-menu');

menu.menus = [];

menu.items = $('.item-row');
menu.backgroundColor = menu.fileMenu.css('background-color');

menu.setup = function () {

  menu.menus.push(new MenuState('file-button', 'file-menu', menu.menus));
  menu.menus.push(new MenuState('view-button', 'view-menu', menu.menus));

  menu.items.mouseover(function () {
//    $(this).css("color", "#ffffff");
    $(this).css("background-color", "#222222");
  });

  menu.items.mouseout(function () {
//    $(this).css("color", "#999999");
    $(this).css("background-color", menu.backgroundColor);
  });

  menu.hookupItems();
};


menu.hookupItems = function () {
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


/**
 * @param {string} buttonId
 * @param {string} menuId
 * @param {Array.<MenuState>} others
 * @constructor
 */
function MenuState(buttonId, menuId, others) {
  var self = this;

  self.mButtonId = buttonId;
  self.mMenuId = menuId;
  self.mIsOpen = false;
  self.mOthers = others;
  self.mButton = $(('#' + self.mButtonId));
  self.mMenu = $(('#' + self.mMenuId));

  setupToggle();

  function setupToggle() {
    self.mButton.click(function () {
      var pos = $(this).offset();
      pos.top += $(this).outerHeight(true);

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

  function enableMouseover() {
    self.mOthers.forEach(function (o) {
      o.mButton.mouseover(function () {
        self.closeOthers();
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