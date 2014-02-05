/**
 * Created by tobysuggate on 1/02/14.
 */

"use strict";

/**
 * @constructor
 */
function MenuState() {}

/** @type {jQuery} */
MenuState.prototype.mButton = null;

/** @type {jQuery} */
MenuState.prototype.mMenu = null;

/** @type {Array.<MenuState>} */
MenuState.prototype.mOthers = null;

/** @type {MenuState} */
MenuState.prototype.mParent = null;

/** @type {boolean} */
MenuState.prototype.mIsSubMenu = false;

/** @type {boolean} */
MenuState.prototype.mSelected = false;

/** @type {boolean} */
MenuState.prototype.mIsOpen = false;

/** @type {jQuery} */
MenuState.prototype.mBackgroundColor = null;

/** @type {jQuery} */
MenuState.prototype.mItems = null;

/**
 * @param {string} buttonId
 * @param {string} menuId
 * @param {Array.<MenuState>} others
 * @param {MenuState=} parent
 */
MenuState.prototype.setup = function(buttonId, menuId, others, parent) {
  var self = this;
  self.mButton = $('#' + buttonId);
  self.mMenu = $('#' + menuId);
  self.mBackgroundColor = self.mMenu.css('background-color');
//  self.mBackgroundColor = "#333333";
  self.mOthers = others;
  self.mParent = parent || null;
  self.mIsSubMenu = parent? true : false;
  self.mItems = $('.item-row');

  self.mItems.mouseover(function () {
//    console.log('mouse over');

    $(this).css("background-color", "#222222");
    if (self.mIsSubMenu) {
      self.setButtonSelected(true);
    }
  });

  self.mItems.mouseout(function () {

    $(this).css("background-color", self.mBackgroundColor);
    if (self.mIsSubMenu) {
      self.setButtonSelected(false);
    }
  });


//  if (self.mIsSubMenu) {
//    self.mButton.mouseout(function () {
//      console.log('mouseout');
//      self.closeOthers();
//    });
//  }


  self.mButton.click(function () {
    self.mIsOpen = !self.mIsOpen;
    self.displayMenu(self.mIsOpen);
  });
};

///**
// * @param {boolean} isSelected
// */
//MenuState.prototype.setSelected = function (isSelected) {
//  this.mSelected = isSelected;
//
//  if (this.mSelected) {
//    $(this).css("background-color", "#222222");
//  }
//  else {
//    $(this).css("background-color", this.mBackgroundColor);
//  }
//};

//Allows mousing to other menus without clicking
MenuState.prototype.enableMouseover = function () {
  var self = this;

  self.mOthers.forEach(function (o) {
    o.mButton.mouseover(function () {
      if (!o.mIsSubMenu) {
        self.closeOthers();
      }
      o.open();
    });
  });
};

MenuState.prototype.disableMouseover = function () {
  this.mOthers.forEach(function (o) {
    o.mButton.unbind('mouseover');
  });
};

MenuState.prototype.closeOthers = function () {
  var self = this;
  this.mOthers.forEach(function (o) {
    if (self !== o) {
//      console.log('self === o');
      o.close();
    }
//    console.log(o);


  });
};

/**
 * @param {boolean} selected
 */
MenuState.prototype.setButtonSelected = function (selected) {
  if (selected) {
    this.mButton.css("background-color", "#222222");
  }
  else {
    this.mButton.css("background-color", this.mBackgroundColor);
  }
};

/**
 * @param {boolean} display
 */
MenuState.prototype.displayMenu = function (display) {
  var self = this;

  if (display) {
    var pos = self.mButton.offset();

    if (self.mIsSubMenu) {
      pos.left = self.mButton.outerWidth();
    }
    else {
      pos.top += self.mButton.outerHeight(true);
    }

    self.mMenu.css({ top: pos.top, left: pos.left });
  }
  self.mMenu.toggleClass('show');
//  self.mButton.toggleClass('darken');


  if (self.mIsOpen) {
    self.enableMouseover();
  }
  else {
    self.disableMouseover();
  }
};

MenuState.prototype.close = function () {
  if (this.mIsOpen) {

//    console.log('close');

    this.mButton.click();
    this.mIsOpen = false;
    this.disableMouseover();

    if (this.mIsSubMenu) {
      this.setButtonSelected(false);
    }
  }
};

MenuState.prototype.open = function () {
  if (!this.mIsOpen) {

//    console.log('open');

    this.mButton.click();
    this.mIsOpen = true;
    this.enableMouseover();
  }
};