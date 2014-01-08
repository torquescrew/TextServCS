/**
 * Created by tobysuggate on 8/01/14.
 */

"use strict";

var menu = menu || {};

menu.fileMenu = $('#file-menu');
menu.fileButton = $('#file-button');

menu.viewButton = $('#view-button');
menu.viewMenu = $('#view-menu');

menu.items = $('.item-row');
menu.backgroundColor = menu.fileMenu.css('background-color');

menu.setup = function () {

  menu.setupMenuToggle(menu.fileMenu, menu.fileButton);
  menu.setupMenuToggle(menu.viewMenu, menu.viewButton);

  menu.items.mouseover(function() {
//    $(this).css("color", "#ffffff");
    $(this).css("background-color", "#222222");
  });

  menu.items.mouseout(function() {
//    $(this).css("color", "#999999");
    $(this).css("background-color", menu.backgroundColor);
  });

};


menu.setupMenuToggle = function (men, but) {
  but.click(function () {
    var pos = $(this).offset();
    pos.top += $(this).outerHeight(true);

    men.css({ top: pos.top, left: pos.left});
    men.toggleClass('show');
    but.toggleClass('darken');
  });
};



menu.setup();