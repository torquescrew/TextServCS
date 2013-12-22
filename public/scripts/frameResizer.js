/**
 * Created by tobysuggate on 22/12/13.
 */

"use strict";

var kId = "tree1";
var kAxis = "horizontal";


function setupResizing() {
//  $("#horizontalBar").click(startHorizontalDrag);
//  $("#horizontalBar").click(function() {
//    console.log("left");
//  });
//  console.log("hi");
//
  document.getElementById('horizontalBar').onclick = startHorizontalDrag;
  document.getElementById('verticalBar').onclick = startVerticalDrag;
}
setupResizing();

function currentEl() {
  return document.getElementById(kId);
}


function getLeft() {
  return document.getElementById('left');
}


function getButtom() {
  return document.getElementById('bottom');
}


function startHorizontalDrag() {
  console.log("startHorizontalDrag");

  $('#left').css('pointer-events', 'none');
  $('#bottom').css('pointer-events', 'none');

  document.body.onmousemove = function (evt) {
    var w = evt.clientX;
//    resizeTermWidth($(document).width() - w);
    getLeft().setAttribute("style", "width:" + w + "px");
  };

  document.body.onmouseup = function () {
    onStopDrag();
  };
}


function disablePointerEvents(disable) {
  
}


function startVerticalDrag() {

  $('#left').css('pointer-events', 'none');
  $('#bottom').css('pointer-events', 'none');

  document.body.onmousemove = function (evt) {
    var h = $(document).height() - (evt.clientY + 5);
//    resizeTermHeight(h);
    getButtom().setAttribute("style", "height:" + h + "px");
  };

  document.body.onmouseup = function () {
    onStopDrag();
  };
}


function onStartDrag(axis, id) {
  if (axis.length > 0) {
    kAxis = axis;
  }

  if (id.length > 0) {
    kId = id;
  }

  if (kAxis === "horizontal") {
    document.body.onmousemove = function (evt) {
      var w = evt.clientX;
//      resizeTermWidth($(document).width() - w);
      currentEl().setAttribute("style", "width:" + w + "px");
    };
  }

  else {
    document.body.onmousemove = function (evt) {
      var h = $(document).height() - (evt.clientY + 5);
//      resizeTermHeight(h);
      currentEl().setAttribute("style", "height:" + h + "px");
    };
  }

  document.body.onmouseup = function () {
    onStopDrag();
  };
}


function onStopDrag() {
//  resizeEditor();
  document.body.onmousemove = null;
  document.body.onmouseup = null;
}


function onDragging() {
  if (kAxis === "horizontal") {
    currentEl().setAttribute("style", "width:" + event.clientX + "px");
  }
  else {
    currentEl().setAttribute("style", "height:" + ($(document).height() - (event.clientY + 5)) + "px");
  }
}