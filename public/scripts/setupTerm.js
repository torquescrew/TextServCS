
//var colWidth, resizeTermHeight, resizeTermWidth, rowHeight, term, termHeight, termId, termWidth;

"use strict";

var term = null;
var termId = 'output2';

(function() {
  return window.onload = function() {
    var socket;
    socket = io.connect();
    socket.on("connect", function() {
      var c;
      c = Terminal.colors;
      c[256] = '#333333';
      c[257] = '#bbbbbb';
      term = new Terminal({
        cols: 80,
        rows: 10,
        colors: c,
        useStyle: true,
        screenKeys: true
      });
      term.on("data", function(data) {
        console.log("data: " + data);
        socket.emit("data", data);
      });
      term.on("title", function(title) {
        document.title = title;
      });
      term.open(document.getElementById(termId));
      socket.on("data", function(data) {
        term.write(data);
      });
      socket.on("disconnect", function() {
        term.destroy();
      });
//      resizeEditor();
      socket.emit("data", 'pwd\r');
    });
  };
}).call();

function termWidth() {
  return document.getElementsByClassName('terminal')[0].clientWidth;
}

function termHeight() {
  return document.getElementsByClassName('terminal')[0].clientHeight;
}

function rowHeight() {
  return termHeight() / term.rows;
}

function colWidth() {
  return termWidth() / term.cols;
}

function resizeTermWidth(width) {
  var col, cols;
  col = colWidth();
  cols = Math.floor(width / col) - 2;
  if (width > col * (term.cols + 1) || width < col * (term.cols - 1)) {
    term.resize(cols, term.rows);
  }
}

function resizeTermHeight(height) {
  var row, rows;
  row = rowHeight();
  rows = Math.floor(height / rowHeight());
  if (height > row * (term.rows + 1) || height < row * (term.rows + 1)) {
    term.resize(term.cols, rows);
  }
}
