"use strict";

var Term = Term || {};

Term.mTerm = null;
Term.mSocket = null;
Term.mId = 'output2';
Term.forground = '#bbbbbb';
Term.background = '#222222';


/**
 * @returns {void}
 */
Term.setup = function () {
  window.onload = function () {

    Term.mSocket = io.connect('http://localhost');

    Term.mSocket.on("connect", function () {
      Term.mTerm = new Terminal({
        cols: 80,
        rows: 10,
        colors: Term.getColors(),
        useStyle: true,
        screenKeys: true
      });

      Term.mTerm.on("data", function (data) {
        Term.mSocket.emit("data", data);
      });

      Term.mTerm.on("title", function (title) {
        document.title = title;
      });

      Term.mTerm.open(document.getElementById(Term.mId));

      Term.mSocket.on("data", function (data) {
        Term.mTerm.write(data);
      });

      Term.mSocket.on("disconnect", function () {
        Term.mTerm.destroy();
      });

      Term.resize();

      Term.mSocket.emit('setup term', '');
      Term.mSocket.emit("data", 'pwd\r');
    });



  };

  $(window).resize(function () {
    Term.resize();
  });
};
Term.setup();
//Term.destroy();

Term.destroy = function () {
  Term.mTerm.destroy();
};


/**
 * @returns {Terminal.colors|*}
 */
Term.getColors = function () {
  var c = Terminal.colors;

  c[256] = Term.background;
  c[257] = Term.forground;

  return c;
};


/**
 * @returns {void}
 */
Term.resize = function () {
  Term.resizeTermWidth($(window).width());
  Term.resizeTermHeight($(window).height());
};

/**
 * @returns {number}
 */
Term.pixWidth = function () {
  return document.getElementsByClassName('terminal')[0].clientWidth;
};

/**
 * @returns {number}
 */
Term.pixHeight = function () {
  return document.getElementsByClassName('terminal')[0].clientHeight;
};

/**
 * @returns {number}
 */
Term.rowHeight = function () {
  return Term.pixHeight() / Term.mTerm.rows;
};

/**
 * @returns {number}
 */
Term.colWidth = function () {
  return Term.pixWidth() / Term.mTerm.cols;
};

/**
 * @param {number} width
 * @returns {void}
 */
Term.resizeTermWidth = function (width) {
  var col = Term.colWidth();
  var cols = Math.floor(width / col) - 2;

  if (width > col * (Term.mTerm.cols + 1) || width < col * (Term.mTerm.cols - 1)) {
    Term.mTerm.resize(cols, Term.mTerm.rows);
  }
};

/**
 * @param {number} height
 * @returns {void}
 */
Term.resizeTermHeight = function (height) {
  var row = Term.rowHeight();
  var rows = Math.floor(height / Term.rowHeight()) - 1;

  if (height > row * (Term.mTerm.rows + 1) || height < row * (Term.mTerm.rows + 1)) {
    Term.mTerm.resize(Term.mTerm.cols, rows);
  }
};
