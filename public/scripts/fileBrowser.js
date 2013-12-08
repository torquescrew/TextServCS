/*global resizeEditor: false, alert: false, confirm: false, console: false, prompt: false, $: false, ace: false */
/**
 * Created by tobysuggate on 19/11/13.
 */

var mouseDown = false;
var kId = 'tree1';
var kAxis = 'horizontal';


/*
 jQuery('selector').on('click', function (evt) {
 jQuery("#tooltip").animate({ left: evt.clientX, top: evt.clientY });
 });
 */

function onStartDrag(axis, id) {
  "use strict";

  if (axis.length > 0) {
    kAxis = axis;
  }
  if (id.length > 0) {
    kId = id;
  }

  mouseDown = true;
  if (kAxis === 'horizontal') {
    document.getElementsByTagName("body")[0].onmousemove = function (evt) {
      document.getElementById(kId).setAttribute("style", "width:" + (evt.clientX) + "px");
    };
//    $('body').on('mousemove', function (evt) {
//      $('#'+kId).attr('style', "width:" + (evt.clientX) + "px");
//    });
  }
  else {
    document.getElementsByTagName("body")[0].onmousemove = function (evt) {
      document.getElementById(kId).setAttribute("style", "height:" + ($(document).height() - (evt.clientY + 5)) + "px");
    };
  }
}

function onStopDrag() {
  "use strict";

  mouseDown = false;
//  editor.resize();
  resizeEditor();
  document.getElementsByTagName("body")[0].onmousemove = null;
//  $('body').off('mousemove');
}

function onDragging() {
  "use strict";

  if (mouseDown) {
    if (kAxis === 'horizontal') {
      document.getElementById(kId).setAttribute("style", "width:" + (event.clientX) + "px");
    }
    else {
      document.getElementById(kId).setAttribute("style", "height:" + ($(document).height() - (event.clientY + 5)) + "px");
    }
  }
}

function setUpFileTree() {
  "use strict";

  var folders = $(".folder");
  folders.mouseover(function () {
    $(this).css("color", "#ffffff");
  });

  folders.mouseout(function () {
    $(this).css("color", "#BBBBBB");
  });

  var files = $(".file");
  files.mouseover(function () {
    $(this).css("color", "#ffffff");
  });

  files.mouseout(function () {
    $(this).css("color", "#999999");
  });

  $('.folder ul').hide();

  $('.folder').click(function () {
    event.stopPropagation();
    $(this).children('ul').slideToggle(100);
  });


  $('.file').click(function () {
    event.stopPropagation();
    openFile($(this).attr('id'));
  });

  $('.myButton').hover(function () {
    $(this).css("color", "#ffffff");
    $(this).css("background-color", "#111111");
  }, function () {
    $(this).css("color", "#bbbbbb");
    $(this).css("background", "none");
  });
}