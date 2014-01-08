/**
 * Created by tobysuggate on 8/01/14.
 */

"use strict";

var menu = menu || {};

/*
 $('#user_button').toggle(function () {
 $("#user_button").css({borderBottomLeftRadius: "0px"});
 }, function () {
 $("#user_button").css({borderBottomLeftRadius: "5px"});
 });
 */

menu.fileMenu = $('#file-menu');
menu.fileButton = $('#file-button');

menu.viewButton = $('#view-button');
menu.viewMenu = $('#view-menu');

menu.items = $('li');
menu.backgroundColor = menu.fileMenu.css('background-color');

menu.setup = function () {


  menu.fileButton.click(function () {
    var pos = $(this).offset();
    pos.top += $(this).outerHeight(true);

    menu.fileMenu.css({ top: pos.top-2, left: pos.left-2 });
    menu.fileMenu.toggleClass('hide-menu');
  });

  menu.viewButton.click(function () {
    var pos = $(this).offset();
    pos.top += $(this).outerHeight(true);

    menu.viewMenu.css({ top: pos.top-2, left: pos.left-2 });
    menu.viewMenu.toggleClass('hide-menu');
  });

  menu.items.mouseover(function() {
//    $(this).css("color", "#ffffff");
    $(this).css("background-color", "#222222");
  });

  menu.items.mouseout(function() {
//    $(this).css("color", "#999999");
    $(this).css("background-color", menu.backgroundColor);
  });

};



menu.setup();