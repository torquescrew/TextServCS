"use strict";

var term = null;
var termId = 'output2';
var socket = null;

(function () {
  window.onload = function () {

    socket = io.connect('http://localhost');

    socket.on("connect", function () {

      var c = Terminal.colors;

      c[256] = '#333333';
      c[257] = '#bbbbbb';

      term = new Terminal({
        cols: 80,
        rows: 10,
        colors: c,
        useStyle: true,
        screenKeys: true
      });

      term.on("data", function (data) {
        console.log("data: " + data);
//        term.write(data);
        socket.emit("data", data);
      });

      term.on("title", function (title) {
        document.title = title;
      });

//      term.open(document.getElementById(termId));
      term.open(document.body);

      socket.on("data", function (data) {
        console.log("write data");
        term.write(data);
      });

      socket.on("disconnect", function () {
        term.destroy();
      });
//      resizeEditor();
      socket.emit("data", 'pwd\r');
      socket.emit('setup term', 'hi');
    });
  };
})();

/**
 * @returns {number}
 */
function termWidth() {
  return document.getElementsByClassName('terminal')[0].clientWidth;
}


/**
 * @returns {number}
 */
function termHeight() {
  return document.getElementsByClassName('terminal')[0].clientHeight;
}

/**
 * @returns {number}
 */
function rowHeight() {
  return termHeight() / term.rows;
}

/**
 * @returns {number}
 */
function colWidth() {
  return termWidth() / term.cols;
}


/**
 * @param {number} width
 */
function resizeTermWidth(width) {
  var col, cols;
  col = colWidth();
  cols = Math.floor(width / col) - 2;
  if (width > col * (term.cols + 1) || width < col * (term.cols - 1)) {
    term.resize(cols, term.rows);
  }
}

/**
 * @param {number} height
 */
function resizeTermHeight(height) {
  var row, rows;
  row = rowHeight();
  rows = Math.floor(height / rowHeight());
  if (height > row * (term.rows + 1) || height < row * (term.rows + 1)) {
    term.resize(term.cols, rows);
  }
}
